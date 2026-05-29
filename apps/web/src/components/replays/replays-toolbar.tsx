import { useCallback, useEffect, useRef, useState } from "react"

import { MagnifierIcon, XmarkIcon } from "@/components/icons"
import { cn } from "@maple/ui/utils"

interface ReplaysToolbarProps {
	/** Current `q` search param (URL substring filter). */
	query: string
	onSearch: (value: string | undefined) => void
	totalSessions: number
	activeSessions: number
	errorSessions: number
	/** Dim the stats while the list is refetching. */
	waiting?: boolean
}

export function ReplaysToolbar({
	query,
	onSearch,
	totalSessions,
	activeSessions,
	errorSessions,
	waiting = false,
}: ReplaysToolbarProps) {
	const [value, setValue] = useState(query)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Keep the input in sync when the param changes elsewhere (e.g. Clear all).
	useEffect(() => {
		setValue(query)
	}, [query])

	const handleChange = useCallback(
		(next: string) => {
			setValue(next)
			if (debounceRef.current) clearTimeout(debounceRef.current)
			debounceRef.current = setTimeout(() => {
				onSearch(next.trim() || undefined)
			}, 300)
		},
		[onSearch],
	)

	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div className="relative w-full max-w-sm">
				<MagnifierIcon
					strokeWidth={2}
					className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<input
					type="text"
					value={value}
					onChange={(e) => handleChange(e.target.value)}
					placeholder="Search by URL…"
					className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				/>
				{value && (
					<button
						type="button"
						onClick={() => handleChange("")}
						aria-label="Clear search"
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
					>
						<XmarkIcon strokeWidth={2} className="size-3.5" />
					</button>
				)}
			</div>

			<div
				className={cn(
					"flex items-center gap-4 text-sm transition-opacity",
					waiting && "opacity-60",
				)}
			>
				<Stat label="sessions" value={totalSessions} />
				<span className="flex items-center gap-1.5">
					<span className="size-1.5 rounded-full bg-success" />
					<span className="font-medium tabular-nums">{activeSessions.toLocaleString()}</span>
					<span className="text-muted-foreground">active</span>
				</span>
				<span className="flex items-center gap-1.5">
					<span className={cn("font-medium tabular-nums", errorSessions > 0 && "text-destructive")}>
						{errorSessions.toLocaleString()}
					</span>
					<span className="text-muted-foreground">with errors</span>
				</span>
			</div>
		</div>
	)
}

function Stat({ label, value }: { label: string; value: number }) {
	return (
		<span className="flex items-center gap-1.5">
			<span className="font-medium tabular-nums">{value.toLocaleString()}</span>
			<span className="text-muted-foreground">{label}</span>
		</span>
	)
}

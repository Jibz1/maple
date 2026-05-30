// Shared loading / empty / error placeholders so every view reads the same way.
// Built on the @maple/ui `Empty` compound + `Skeleton` so local mode matches the
// main web app's states exactly.

import type { ReactNode } from "react"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@maple/ui/components/ui/empty"
import { Button } from "@maple/ui/components/ui/button"
import { Skeleton } from "@maple/ui/components/ui/skeleton"
import { CircleWarningIcon } from "@maple/ui/components/icons"

export function EmptyState({
	icon,
	title,
	hint,
}: {
	icon?: ReactNode
	title: string
	hint?: ReactNode
}) {
	return (
		<Empty className="h-full">
			{icon ? <EmptyMedia variant="icon">{icon}</EmptyMedia> : null}
			<EmptyHeader>
				<EmptyTitle>{title}</EmptyTitle>
				{hint ? <EmptyDescription>{hint}</EmptyDescription> : null}
			</EmptyHeader>
		</Empty>
	)
}

export function ErrorState({
	label,
	error,
	onRetry,
}: {
	label: string
	error: unknown
	onRetry?: () => void
}) {
	const message = error instanceof Error ? error.message : String(error)
	return (
		<Empty className="h-full">
			<EmptyMedia variant="icon">
				<CircleWarningIcon className="text-destructive" />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle>Couldn’t load {label}</EmptyTitle>
				<EmptyDescription className="font-mono text-xs break-all">{message}</EmptyDescription>
			</EmptyHeader>
			{onRetry ? (
				<EmptyContent>
					<Button variant="outline" size="sm" onClick={onRetry}>
						Try again
					</Button>
				</EmptyContent>
			) : null}
		</Empty>
	)
}

/**
 * Content-shaped loading placeholder. `table` for the trace/log row lists,
 * `card` for the session card stack — keeps every loading state on the same
 * skeleton vocabulary instead of a bare spinner.
 */
export function ListSkeleton({
	rows = 8,
	variant = "table",
}: {
	rows?: number
	variant?: "table" | "card"
}) {
	return (
		<div className="space-y-2 p-4">
			{Array.from({ length: rows }).map((_, i) => (
				<Skeleton
					key={i}
					className={variant === "card" ? "h-[68px] w-full rounded-xl" : "h-10 w-full rounded-md"}
				/>
			))}
		</div>
	)
}

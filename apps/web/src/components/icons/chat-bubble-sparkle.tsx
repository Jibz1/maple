import type { IconProps } from "./icon"

const paths: ReadonlyArray<string> = [
	"M4 4H20V15H9L5 19V15H4Z",
	"M13 5L14 8L17 9L14 10L13 13L12 10L9 9L12 8L13 5Z",
]

function ChatBubbleSparkleIcon({ size = 24, className, ...props }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className={className}
			fill="none"
			aria-hidden="true"
			{...props}
		>
			{paths.map((d, i) => (
				<path key={i} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
			))}
		</svg>
	)
}
export { ChatBubbleSparkleIcon }

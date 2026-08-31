interface BadgeProps {
	index: number;
}

export default function Badge({ index }: BadgeProps) {
	return (
		<span className="si-badge rounded-full bg-green-500 px-2 py-0.5 font-semibold text-[10px] text-slate-900 shadow-sm">
			webext-content-ui #{index + 1}
		</span>
	);
}

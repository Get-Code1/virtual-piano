interface StatusBarProps {
  instrumentLabel: string
  rangeLabel: string
  volume: number
  activeNoteNames: string[]
}

function StatusBar({
  instrumentLabel,
  rangeLabel,
  volume,
  activeNoteNames,
}: StatusBarProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-400">
      <span>{instrumentLabel}</span>
      <span aria-hidden="true">·</span>
      <span>Range {rangeLabel}</span>
      <span aria-hidden="true">·</span>
      <span>Volume {Math.round(volume * 100)}%</span>
      <span aria-hidden="true">·</span>
      <span className="min-w-0 truncate">
        Playing: {activeNoteNames.length > 0 ? activeNoteNames.join(', ') : '—'}
      </span>
    </div>
  )
}

export default StatusBar

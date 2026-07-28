interface ControlsProps {
  showLabels: boolean
  onToggleLabels: () => void
  onShiftOctave: (direction: -1 | 1) => void
  canShiftDown: boolean
  canShiftUp: boolean
}

function Controls({
  showLabels,
  onToggleLabels,
  onShiftOctave,
  canShiftDown,
  canShiftUp,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-lg bg-neutral-800/60 px-4 py-3 text-neutral-200 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-400">Keyboard octave</span>
        <button
          type="button"
          aria-label="Shift computer-keyboard mapping down an octave"
          disabled={!canShiftDown}
          onClick={() => onShiftOctave(-1)}
          className="h-7 w-7 rounded-full bg-neutral-700 text-neutral-100 shadow transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ◀
        </button>
        <button
          type="button"
          aria-label="Shift computer-keyboard mapping up an octave"
          disabled={!canShiftUp}
          onClick={() => onShiftOctave(1)}
          className="h-7 w-7 rounded-full bg-neutral-700 text-neutral-100 shadow transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ▶
        </button>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showLabels}
          onChange={onToggleLabels}
          className="h-4 w-4 accent-amber-600"
        />
        Show key labels
      </label>
    </div>
  )
}

export default Controls

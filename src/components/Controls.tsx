import type { WaveformType } from '../types'

export const INSTRUMENTS: { value: WaveformType; label: string }[] = [
  { value: 'piano', label: 'Grand Piano' },
  { value: 'sine', label: 'Sine' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'sawtooth', label: 'Sawtooth' },
]

interface ControlsProps {
  showLabels: boolean
  onToggleLabels: () => void
  onShiftOctave: (direction: -1 | 1) => void
  canShiftDown: boolean
  canShiftUp: boolean
  instrument: WaveformType
  onInstrumentChange: (instrument: WaveformType) => void
  volume: number
  onVolumeChange: (volume: number) => void
}

function Controls({
  showLabels,
  onToggleLabels,
  onShiftOctave,
  canShiftDown,
  canShiftUp,
  instrument,
  onInstrumentChange,
  volume,
  onVolumeChange,
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

      <label className="flex items-center gap-2 text-sm">
        <span className="text-neutral-400">Instrument</span>
        <select
          value={instrument}
          onChange={(e) => onInstrumentChange(e.target.value as WaveformType)}
          className="rounded border border-neutral-600 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
        >
          {INSTRUMENTS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-neutral-400"
          aria-hidden="true"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24 accent-amber-600"
          aria-label="Volume"
        />
      </label>

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

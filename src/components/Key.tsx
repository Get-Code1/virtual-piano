import type { Note } from '../types'

interface KeyProps {
  note: Note
  label?: string
  showLabel: boolean
  isPressed: boolean
  onPress: (midi: number) => void
  onRelease: (midi: number) => void
}

function Key({ note, label, showLabel, isPressed, onPress, onRelease }: KeyProps) {
  const stopTouchScroll = (e: React.SyntheticEvent) => e.preventDefault()

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      onPress(note.midi)
    },
    onPointerUp: () => onRelease(note.midi),
    onPointerLeave: () => onRelease(note.midi),
    onPointerCancel: () => onRelease(note.midi),
    onContextMenu: stopTouchScroll,
    onTouchStart: stopTouchScroll,
  }

  if (note.isSharp) {
    return (
      <button
        type="button"
        aria-label={note.name}
        data-midi={note.midi}
        className={`absolute top-0 h-[60%] w-full select-none rounded-b-lg border border-black bg-gradient-to-b shadow-[0_3px_6px_rgba(0,0,0,0.6)] transition-all duration-75 ${
          isPressed
            ? 'translate-y-0.5 from-neutral-600 to-neutral-950 shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
            : 'from-neutral-700 to-black'
        }`}
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        {showLabel && label && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.65rem] text-neutral-300">
            {label}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="relative h-full min-w-[32px] flex-1">
      <button
        type="button"
        aria-label={note.name}
        data-midi={note.midi}
        className={`relative h-full w-full select-none rounded-b-lg border border-neutral-400/70 bg-gradient-to-b shadow-[0_3px_4px_rgba(0,0,0,0.2)] transition-all duration-75 ${
          isPressed
            ? 'translate-y-0.5 from-neutral-300 to-neutral-400 shadow-inner'
            : 'from-white to-neutral-100'
        }`}
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        {showLabel && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-neutral-500">
            {label ?? note.name}
          </span>
        )}
      </button>
    </div>
  )
}

export default Key

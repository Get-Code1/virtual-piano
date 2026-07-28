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
        className={`absolute top-0 h-[60%] w-full select-none rounded-b-md border border-neutral-950 shadow-md transition-colors ${
          isPressed ? 'bg-neutral-600' : 'bg-neutral-900'
        }`}
        style={{ touchAction: 'none' }}
        {...handlers}
      >
        {showLabel && label && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-neutral-300">
            {label}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="relative h-full flex-1">
      <button
        type="button"
        aria-label={note.name}
        className={`relative h-full w-full select-none rounded-b-md border border-neutral-300 shadow transition-colors ${
          isPressed ? 'bg-neutral-300' : 'bg-white'
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

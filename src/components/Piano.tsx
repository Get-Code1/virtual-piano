import { forwardRef } from 'react'
import type { Note } from '../types'
import type { KeyboardMapping } from '../audio/keyboardMapping'
import Key from './Key'

interface PianoProps {
  notes: Note[]
  keyboardMapping: KeyboardMapping
  showLabels: boolean
  pressedNotes: Set<number>
  onPress: (midi: number) => void
  onRelease: (midi: number) => void
}

const BLACK_KEY_WIDTH_RATIO = 0.6
const MIN_WHITE_KEY_WIDTH_PX = 32

const Piano = forwardRef<HTMLDivElement, PianoProps>(function Piano(
  { notes, keyboardMapping, showLabels, pressedNotes, onPress, onRelease },
  scrollRef,
) {
  const whiteNotes = notes.filter((note) => !note.isSharp)
  const whiteWidthPercent = 100 / whiteNotes.length
  const blackWidthPercent = whiteWidthPercent * BLACK_KEY_WIDTH_RATIO

  let whiteIndex = 0
  const blackKeys: { note: Note; leftPercent: number }[] = []
  for (const note of notes) {
    if (note.isSharp) {
      blackKeys.push({
        note,
        leftPercent: whiteIndex * whiteWidthPercent - blackWidthPercent / 2,
      })
    } else {
      whiteIndex++
    }
  }

  return (
    <div
      ref={scrollRef}
      className="w-full overflow-x-auto overflow-y-hidden rounded-b-xl bg-neutral-950 p-2"
    >
      <div
        className="relative flex h-56 sm:h-64"
        style={{
          width: '100%',
          minWidth: `${whiteNotes.length * MIN_WHITE_KEY_WIDTH_PX}px`,
        }}
      >
        {whiteNotes.map((note) => (
          <Key
            key={note.midi}
            note={note}
            label={keyboardMapping.midiToKey.get(note.midi)}
            showLabel={showLabels}
            isPressed={pressedNotes.has(note.midi)}
            onPress={onPress}
            onRelease={onRelease}
          />
        ))}
        {blackKeys.map(({ note, leftPercent }) => (
          <div
            key={note.midi}
            className="absolute top-0 z-10 h-full"
            style={{ left: `${leftPercent}%`, width: `${blackWidthPercent}%` }}
          >
            <Key
              note={note}
              label={keyboardMapping.midiToKey.get(note.midi)}
              showLabel={showLabels}
              isPressed={pressedNotes.has(note.midi)}
              onPress={onPress}
              onRelease={onRelease}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

export default Piano

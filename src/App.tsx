import { useCallback, useMemo, useRef, useState } from 'react'
import { MIDI_C2, generateNoteRange } from './audio/notes'
import { buildKeyboardMapping } from './audio/keyboardMapping'
import { playNote, stopNote } from './audio/audioEngine'
import { usePianoKeyboardInput } from './hooks/usePianoKeyboardInput'
import Piano from './components/Piano'
import Controls from './components/Controls'

const OCTAVES = 4
const RANGE_START = MIDI_C2
const RANGE_END = MIDI_C2 + OCTAVES * 12
// Highest offset the computer-keyboard mapping reaches above its base note
// (the "p" white key, see keyboardMapping.ts) — keeps octave-shifting from
// anchoring the mapping somewhere it would spill past the rendered range.
const MAPPING_SPAN = 16
const DEFAULT_KEYBOARD_BASE = RANGE_START + 12

function App() {
  const [showLabels, setShowLabels] = useState(true)
  const [keyboardBase, setKeyboardBase] = useState(DEFAULT_KEYBOARD_BASE)
  const [pressedNotes, setPressedNotes] = useState<Set<number>>(
    () => new Set(),
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  const notes = useMemo(
    () => generateNoteRange(RANGE_START, RANGE_END),
    [],
  )
  const keyboardMapping = useMemo(
    () => buildKeyboardMapping(keyboardBase),
    [keyboardBase],
  )

  const handlePress = useCallback((midi: number) => {
    playNote(midi)
    setPressedNotes((prev) => {
      if (prev.has(midi)) return prev
      const next = new Set(prev)
      next.add(midi)
      return next
    })
  }, [])

  const handleRelease = useCallback((midi: number) => {
    stopNote(midi)
    setPressedNotes((prev) => {
      if (!prev.has(midi)) return prev
      const next = new Set(prev)
      next.delete(midi)
      return next
    })
  }, [])

  const handleShiftOctave = useCallback(
    (direction: -1 | 1) => {
      const nextBase = keyboardBase + direction * 12
      if (nextBase < RANGE_START || nextBase + MAPPING_SPAN > RANGE_END) return
      setKeyboardBase(nextBase)
      scrollRef.current
        ?.querySelector(`[data-midi="${nextBase}"]`)
        ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    },
    [keyboardBase],
  )

  usePianoKeyboardInput(keyboardMapping, handlePress, handleRelease)

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 px-4 py-8 text-neutral-100">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl ring-1 ring-black/40">
        <div className="bg-gradient-to-b from-amber-800 to-amber-950 px-6 py-4 text-center shadow-md">
          <h1 className="font-serif text-3xl tracking-wide text-amber-50">
            Virtual Grand Piano
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 p-4 sm:p-6">
          <Controls
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels((prev) => !prev)}
            onShiftOctave={handleShiftOctave}
            canShiftDown={keyboardBase - 12 >= RANGE_START}
            canShiftUp={keyboardBase + 12 + MAPPING_SPAN <= RANGE_END}
          />

          <Piano
            ref={scrollRef}
            notes={notes}
            keyboardMapping={keyboardMapping}
            showLabels={showLabels}
            pressedNotes={pressedNotes}
            onPress={handlePress}
            onRelease={handleRelease}
          />
        </div>
      </div>
    </div>
  )
}

export default App

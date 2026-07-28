import { useCallback, useMemo, useState } from 'react'
import { MIDI_C4, generateNoteRange } from './audio/notes'
import { buildKeyboardMapping } from './audio/keyboardMapping'
import { playNote, stopNote } from './audio/audioEngine'
import { usePianoKeyboardInput } from './hooks/usePianoKeyboardInput'
import Piano from './components/Piano'
import Controls from './components/Controls'

const OCTAVES = 2

function App() {
  const [showLabels, setShowLabels] = useState(true)
  const [pressedNotes, setPressedNotes] = useState<Set<number>>(
    () => new Set(),
  )

  const notes = useMemo(
    () => generateNoteRange(MIDI_C4, MIDI_C4 + OCTAVES * 12),
    [],
  )
  const keyboardMapping = useMemo(() => buildKeyboardMapping(MIDI_C4), [])

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

  usePianoKeyboardInput(keyboardMapping, handlePress, handleRelease)

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-neutral-900 px-4 py-8 text-neutral-100">
      <h1 className="text-2xl font-semibold">Virtual Piano</h1>
      <Controls
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
      />
      <div className="w-full max-w-4xl">
        <Piano
          notes={notes}
          keyboardMapping={keyboardMapping}
          showLabels={showLabels}
          pressedNotes={pressedNotes}
          onPress={handlePress}
          onRelease={handleRelease}
        />
      </div>
    </div>
  )
}

export default App

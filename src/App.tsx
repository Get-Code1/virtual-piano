import { useMemo, useState } from 'react'
import { MIDI_C4, generateNoteRange } from './audio/notes'
import { buildKeyboardMapping } from './audio/keyboardMapping'
import Piano from './components/Piano'
import Controls from './components/Controls'

const OCTAVES = 2

function App() {
  const [showLabels, setShowLabels] = useState(true)
  const [pressedNotes] = useState<Set<number>>(() => new Set())

  const notes = useMemo(
    () => generateNoteRange(MIDI_C4, MIDI_C4 + OCTAVES * 12),
    [],
  )
  const keyboardMapping = useMemo(() => buildKeyboardMapping(MIDI_C4), [])

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
          onPress={() => {}}
          onRelease={() => {}}
        />
      </div>
    </div>
  )
}

export default App

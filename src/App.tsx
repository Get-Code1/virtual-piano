import { useCallback, useMemo, useRef, useState } from 'react'
import { MIDI_C2, generateNoteRange, midiToNoteName } from './audio/notes'
import { buildKeyboardMapping } from './audio/keyboardMapping'
import { playNote, stopNote, setMasterVolume, setWaveform } from './audio/audioEngine'
import { usePianoKeyboardInput } from './hooks/usePianoKeyboardInput'
import { useMetronome } from './hooks/useMetronome'
import type { WaveformType } from './types'
import Piano from './components/Piano'
import Controls, { INSTRUMENTS } from './components/Controls'
import StatusBar from './components/StatusBar'

const OCTAVES = 4
const RANGE_START = MIDI_C2
const RANGE_END = MIDI_C2 + OCTAVES * 12
// Highest offset the computer-keyboard mapping reaches above its base note
// (the "p" white key, see keyboardMapping.ts) — keeps octave-shifting from
// anchoring the mapping somewhere it would spill past the rendered range.
const MAPPING_SPAN = 16
const DEFAULT_KEYBOARD_BASE = RANGE_START + 12
const DEFAULT_VOLUME = 0.7
const DEFAULT_BPM = 100

function App() {
  const [showLabels, setShowLabels] = useState(true)
  const [keyboardBase, setKeyboardBase] = useState(DEFAULT_KEYBOARD_BASE)
  const [instrument, setInstrument] = useState<WaveformType>('piano')
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [bpm, setBpm] = useState(DEFAULT_BPM)
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false)
  const [beatTick, setBeatTick] = useState(0)
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

  const handleInstrumentChange = useCallback((next: WaveformType) => {
    setInstrument(next)
    setWaveform(next)
  }, [])

  const handleVolumeChange = useCallback((next: number) => {
    setVolume(next)
    setMasterVolume(next)
  }, [])

  usePianoKeyboardInput(keyboardMapping, handlePress, handleRelease)
  useMetronome(bpm, isMetronomePlaying, () => setBeatTick((t) => t + 1))

  const activeNoteNames = useMemo(
    () => [...pressedNotes].sort((a, b) => a - b).map(midiToNoteName),
    [pressedNotes],
  )
  const instrumentLabel =
    INSTRUMENTS.find((i) => i.value === instrument)?.label ?? instrument

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
            instrument={instrument}
            onInstrumentChange={handleInstrumentChange}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            bpm={bpm}
            onBpmChange={setBpm}
            isMetronomePlaying={isMetronomePlaying}
            onToggleMetronome={() => setIsMetronomePlaying((prev) => !prev)}
            beatTick={beatTick}
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

          <StatusBar
            instrumentLabel={instrumentLabel}
            rangeLabel={`${midiToNoteName(RANGE_START)}–${midiToNoteName(RANGE_END)}`}
            volume={volume}
            activeNoteNames={activeNoteNames}
          />
        </div>
      </div>
    </div>
  )
}

export default App

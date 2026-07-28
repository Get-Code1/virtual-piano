import type { Note } from '../types'

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

export const MIDI_C4 = 60

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

export function midiToNoteName(midi: number): string {
  const name = NOTE_NAMES[midi % 12]
  const octave = Math.floor(midi / 12) - 1
  return `${name}${octave}`
}

/** Inclusive range of notes from `startMidi` to `endMidi`. */
export function generateNoteRange(startMidi: number, endMidi: number): Note[] {
  const notes: Note[] = []
  for (let midi = startMidi; midi <= endMidi; midi++) {
    notes.push({
      midi,
      name: midiToNoteName(midi),
      isSharp: NOTE_NAMES[midi % 12].includes('#'),
    })
  }
  return notes
}

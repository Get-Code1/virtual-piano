export type WaveformType = 'sine' | 'triangle' | 'sawtooth'

export interface Note {
  /** MIDI note number (C4 = 60). */
  midi: number
  /** Note name including octave, e.g. "C#4". */
  name: string
  isSharp: boolean
}

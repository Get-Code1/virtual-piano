// Computer-keyboard layout, anchored to a base MIDI note (the lowest visible C).
// QWERTY row plays white keys; the number row plays black keys, positioned
// directly above the white key each black key sits to the right of — matching
// where black keys actually fall on a real piano (none between E-F or B-C).
const WHITE_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16]

const BLACK_KEYS = ['2', '3', '5', '6', '7', '9', '0']
const BLACK_OFFSETS = [1, 3, 6, 8, 10, 13, 15]

export interface KeyboardMapping {
  keyToMidi: Map<string, number>
  midiToKey: Map<number, string>
}

export function buildKeyboardMapping(baseMidi: number): KeyboardMapping {
  const keyToMidi = new Map<string, number>()
  const midiToKey = new Map<number, string>()

  WHITE_KEYS.forEach((key, i) => {
    const midi = baseMidi + WHITE_OFFSETS[i]
    keyToMidi.set(key, midi)
    midiToKey.set(midi, key.toUpperCase())
  })
  BLACK_KEYS.forEach((key, i) => {
    const midi = baseMidi + BLACK_OFFSETS[i]
    keyToMidi.set(key, midi)
    midiToKey.set(midi, key)
  })

  return { keyToMidi, midiToKey }
}

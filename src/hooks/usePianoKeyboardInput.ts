import { useEffect } from 'react'
import type { KeyboardMapping } from '../audio/keyboardMapping'

export function usePianoKeyboardInput(
  keyboardMapping: KeyboardMapping,
  onPress: (midi: number) => void,
  onRelease: (midi: number) => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const midi = keyboardMapping.keyToMidi.get(e.key.toLowerCase())
      if (midi === undefined) return
      onPress(midi)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const midi = keyboardMapping.keyToMidi.get(e.key.toLowerCase())
      if (midi === undefined) return
      onRelease(midi)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [keyboardMapping, onPress, onRelease])
}

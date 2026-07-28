import { useEffect, useRef } from 'react'
import { getAudioTime, playClickAt } from '../audio/audioEngine'

// Classic Web Audio lookahead scheduler: a coarse JS timer just checks
// whether it's time to schedule the next click, but the click itself is
// scheduled against AudioContext time, so playback doesn't drift like a
// raw setInterval beat would.
const SCHEDULE_AHEAD_SECONDS = 0.1
const LOOKAHEAD_INTERVAL_MS = 25

export function useMetronome(
  bpm: number,
  isPlaying: boolean,
  onBeat: () => void,
) {
  const onBeatRef = useRef(onBeat)
  onBeatRef.current = onBeat

  useEffect(() => {
    if (!isPlaying) return

    const secondsPerBeat = 60 / bpm
    let nextNoteTime = getAudioTime() + 0.05

    const timer = setInterval(() => {
      const now = getAudioTime()
      while (nextNoteTime < now + SCHEDULE_AHEAD_SECONDS) {
        playClickAt(nextNoteTime)
        const delayMs = Math.max(0, (nextNoteTime - now) * 1000)
        setTimeout(() => onBeatRef.current(), delayMs)
        nextNoteTime += secondsPerBeat
      }
    }, LOOKAHEAD_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [isPlaying, bpm])
}

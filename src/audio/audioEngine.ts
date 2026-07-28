import type { WaveformType } from '../types'
import { midiToFrequency } from './notes'

const ATTACK_SECONDS = 0.003
const DECAY_SECONDS = 0.35
const SUSTAIN_LEVEL = 0.3
const RELEASE_SECONDS = 0.2
// How quickly a held note keeps fading, mimicking a struck string losing
// energy even while the key stays down (a piano has no true flat sustain).
const HOLD_DECAY_TIME_CONSTANT = 2.5

// Harmonic amplitudes (fundamental + 8 overtones) approximating a piano-like
// spectrum, used to build a custom PeriodicWave instead of a native oscillator
// type — index 0 is the required DC term and stays 0.
const PIANO_HARMONICS = [0, 1, 0.55, 0.35, 0.22, 0.14, 0.1, 0.07, 0.05, 0.03]

interface Voice {
  oscillator: OscillatorNode
  gain: GainNode
}

let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let pianoWave: PeriodicWave | null = null
let waveform: WaveformType = 'piano'
let masterVolume = 0.7
const activeVoices = new Map<number, Voice>()

function getContext(): { context: AudioContext; master: GainNode } {
  if (!audioContext || !masterGain) {
    audioContext = new AudioContext()
    masterGain = audioContext.createGain()
    masterGain.gain.value = masterVolume
    masterGain.connect(audioContext.destination)
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return { context: audioContext, master: masterGain }
}

function getPianoWave(context: AudioContext): PeriodicWave {
  if (!pianoWave) {
    const real = new Float32Array(PIANO_HARMONICS.length)
    const imag = new Float32Array(PIANO_HARMONICS)
    pianoWave = context.createPeriodicWave(real, imag)
  }
  return pianoWave
}

export function setWaveform(type: WaveformType) {
  waveform = type
}

export function setMasterVolume(volume: number) {
  masterVolume = volume
  if (masterGain) masterGain.gain.value = volume
}

export function playNote(midi: number) {
  if (activeVoices.has(midi)) return

  const { context, master } = getContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  if (waveform === 'piano') {
    oscillator.setPeriodicWave(getPianoWave(context))
  } else {
    oscillator.type = waveform
  }
  oscillator.frequency.value = midiToFrequency(midi)

  const now = context.currentTime
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(1, now + ATTACK_SECONDS)
  gain.gain.exponentialRampToValueAtTime(
    SUSTAIN_LEVEL,
    now + ATTACK_SECONDS + DECAY_SECONDS,
  )
  gain.gain.setTargetAtTime(
    0.0001,
    now + ATTACK_SECONDS + DECAY_SECONDS,
    HOLD_DECAY_TIME_CONSTANT,
  )

  oscillator.connect(gain)
  gain.connect(master)
  oscillator.start()

  activeVoices.set(midi, { oscillator, gain })
}

export function stopNote(midi: number) {
  const voice = activeVoices.get(midi)
  if (!voice) return
  activeVoices.delete(midi)

  const { context } = getContext()
  const { oscillator, gain } = voice
  const now = context.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(0, now + RELEASE_SECONDS)
  oscillator.stop(now + RELEASE_SECONDS)
  oscillator.addEventListener('ended', () => {
    oscillator.disconnect()
    gain.disconnect()
  })
}

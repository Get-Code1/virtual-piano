import type { WaveformType } from '../types'
import { midiToFrequency } from './notes'

const ATTACK_SECONDS = 0.005
const RELEASE_SECONDS = 0.06

interface Voice {
  oscillator: OscillatorNode
  gain: GainNode
}

let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let waveform: WaveformType = 'sine'
const activeVoices = new Map<number, Voice>()

function getContext(): { context: AudioContext; master: GainNode } {
  if (!audioContext || !masterGain) {
    audioContext = new AudioContext()
    masterGain = audioContext.createGain()
    masterGain.connect(audioContext.destination)
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return { context: audioContext, master: masterGain }
}

export function setWaveform(type: WaveformType) {
  waveform = type
}

export function setMasterVolume(volume: number) {
  const { master } = getContext()
  master.gain.value = volume
}

export function playNote(midi: number) {
  if (activeVoices.has(midi)) return

  const { context, master } = getContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = waveform
  oscillator.frequency.value = midiToFrequency(midi)

  gain.gain.setValueAtTime(0, context.currentTime)
  gain.gain.linearRampToValueAtTime(1, context.currentTime + ATTACK_SECONDS)

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
  gain.gain.cancelScheduledValues(context.currentTime)
  gain.gain.setValueAtTime(gain.gain.value, context.currentTime)
  gain.gain.linearRampToValueAtTime(0, context.currentTime + RELEASE_SECONDS)
  oscillator.stop(context.currentTime + RELEASE_SECONDS)
  oscillator.addEventListener('ended', () => {
    oscillator.disconnect()
    gain.disconnect()
  })
}

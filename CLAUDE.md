# CLAUDE.md

Guidance for working on this repo.

## What this is

A single-page virtual piano. No backend, no persistence — everything runs in
the browser. Sound is synthesized with the Web Audio API (oscillators), not
audio file playback.

## Stack

- **Vite + React + TypeScript** — chosen over Next.js because there's no
  routing, SSR, or data fetching here; a plain client SPA is simpler and
  matches the "no over-engineering" goal.
- **Tailwind CSS v4** via `@tailwindcss/vite` (no separate config file needed;
  it scans source files automatically).
- No state management library — component state and a couple of small hooks
  are enough for this app's size.
- No test framework has been introduced. Verification is manual: `npm run
  dev` and play the piano in a browser (mouse, touch emulation, and computer
  keyboard).

## Project structure

```
src/
  App.tsx                    # top-level layout, wires controls to the piano
  types.ts                   # shared types (Note, WaveformType, etc.)
  audio/
    notes.ts                 # note range generation, MIDI -> frequency math
    keyboardMapping.ts       # computer-key -> note mapping table
    audioEngine.ts           # AudioContext singleton, playNote/stopNote, master gain, waveform
  hooks/
    usePianoKeyboardInput.ts # keydown/keyup -> note on/off, ignores OS auto-repeat
    useRecorder.ts           # record/playback of played notes
  components/
    Piano.tsx                # lays out white + black keys for the current octave range
    Key.tsx                  # single key: pointer handlers, pressed-visual state, label
    Controls.tsx             # label toggle, octave shift, volume, waveform, record/play
```

## Conventions

- **Input handling uses Pointer Events** (`onPointerDown` / `onPointerUp` /
  `onPointerLeave`), not separate mouse/touch handlers — one code path covers
  mouse, touch, and pen. Keys set `touch-action: none` so touches don't scroll
  or zoom the page.
- **One shared `AudioContext`**, created lazily and resumed on the first user
  gesture (browsers require this). Don't create a new `AudioContext` per note.
- **Notes are identified by MIDI number** everywhere (frequency is derived
  from it: `440 * 2^((midi-69)/12)`), not by note-name strings, to keep octave
  math trivial.
- **Active notes live in a `Map<midi, ...>`** so the same note can't be
  double-triggered by OS key auto-repeat, and so multiple simultaneous notes
  (chords / mouse + keyboard at once) all play and release independently.
- Keep components small and presentational; audio/timing logic lives in
  `audio/` and `hooks/`, not inside JSX event handlers.

## Working practices

- Commit after each working milestone (keyboard renders, audio works,
  recording works, etc.) rather than one large commit.
- Stop after the core keyboard + sound milestone for manual browser testing
  before starting the extras (octave shift, volume, waveform selector,
  record/playback).

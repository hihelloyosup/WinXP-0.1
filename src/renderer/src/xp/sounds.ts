import startup from '../assets/sounds/startup.wav'
import logon from '../assets/sounds/logon.wav'
import errorSnd from '../assets/sounds/error.wav'

export const Sounds = { startup, logon, error: errorSnd }

let masterVolume = 1
let masterMuted = false

export function setAudioPreferences(volumePercent: number, muted: boolean): void {
  masterVolume = Math.max(0, Math.min(1, volumePercent / 100))
  masterMuted = muted
}

export function playSound(src: string, volume = 0.6): void {
  try {
    const a = new Audio(src)
    a.volume = masterMuted ? 0 : volume * masterVolume
    void a.play().catch(() => undefined)
  } catch {
    /* ignore */
  }
}

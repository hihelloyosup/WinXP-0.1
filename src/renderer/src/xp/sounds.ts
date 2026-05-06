import startup from '../assets/sounds/startup.wav'
import logon from '../assets/sounds/logon.wav'
import errorSnd from '../assets/sounds/error.wav'
import chord from '../assets/sounds/chord.wav'
import ding from '../assets/sounds/ding.wav'
import tada from '../assets/sounds/tada.wav'
import criticalStop from '../assets/sounds/critical_stop.wav'

export const Sounds = {
  startup,
  logon,
  error: errorSnd,
  chord,
  ding,
  tada,
  criticalStop
}

let masterVolume = 1
let masterMuted = false

export function setAudioPreferences(volumePercent: number, muted: boolean): void {
  masterVolume = Math.max(0, Math.min(1, volumePercent / 100))
  masterMuted = muted
}

export function playSound(src: string, volume = 0.6): void {
  console.log('playSound called! src:', src, 'volume:', volume, 'masterMuted:', masterMuted, 'masterVolume:', masterVolume)
  try {
    const a = new Audio(src)
    a.volume = masterMuted ? 0 : volume * masterVolume
    a.play().then(() => {
      console.log('Sound played successfully!')
    }).catch(err => {
      console.error('Error playing sound:', err)
    })
  } catch (err) {
    console.error('Error in playSound function:', err)
  }
}

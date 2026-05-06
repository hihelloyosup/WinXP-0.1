/**
 * Gerador de sons usando Web Audio API
 * Cria beeps e sons para diferentes tipos de mensagens
 */

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

export function playErrorBeep(volume = 0.5): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const duration = 0.3

    // Criar oscillator para tom de erro (baixa frequência)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(800, now)
    osc.frequency.setValueAtTime(600, now + duration * 0.5)

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

    osc.start(now)
    osc.stop(now + duration)
  } catch {
    /* ignore */
  }
}

export function playWarningBeep(volume = 0.5): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Dois beeps curtos
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.setValueAtTime(600 + i * 100, now + i * 0.15)

      gain.gain.setValueAtTime(volume, now + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.15)

      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.15)
    }
  } catch {
    /* ignore */
  }
}

export function playSuccessBeep(volume = 0.4): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Dois beeps ascendentes
    const frequencies = [800, 1200]
    for (let i = 0; i < frequencies.length; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.setValueAtTime(frequencies[i], now + i * 0.15)

      gain.gain.setValueAtTime(volume, now + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2)

      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.2)
    }
  } catch {
    /* ignore */
  }
}

export function playInfoBeep(volume = 0.4): void {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Um beep simples
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.setValueAtTime(1000, now)
    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc.start(now)
    osc.stop(now + 0.2)
  } catch {
    /* ignore */
  }
}

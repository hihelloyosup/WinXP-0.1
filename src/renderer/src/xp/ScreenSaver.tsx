import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

export type ScreenSaverType = 'nenhum' | 'matrix' | 'stars' | 'bubbles' | 'logo' | 'black'

interface ScreenSaverProps {
  type: ScreenSaverType
  onActivity: () => void
}

// Matrix Screensaver
const MatrixSaver: React.FC = (): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 20)
    const drops: number[] = new Array(cols).fill(1)
    const chars = '0123456789ABCDEF'

    let animationId: number

    const draw = (): void => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0F0'
      ctx.font = '15px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * 20, drops[i] * 20)

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return <Canvas ref={canvasRef} />
}

// Stars Screensaver (3D tube effect)
const StarsSaver: React.FC = (): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; z: number }[] = []
    const numStars = 800

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000
      })
    }

    let animationId: number
    const speed = 2

    const draw = (): void => {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      for (const star of stars) {
        star.z -= speed
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000
          star.y = (Math.random() - 0.5) * 2000
          star.z = 2000
        }

        const x = (star.x / star.z) * 500 + cx
        const y = (star.y / star.z) * 500 + cy
        const size = (1 - star.z / 2000) * 3

        if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
          const brightness = Math.floor((1 - star.z / 2000) * 255)
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`
          ctx.fillRect(x, y, size, size)
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return <Canvas ref={canvasRef} />
}

// Bubbles Screensaver
const BubblesSaver: React.FC = (): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bubbles: { x: number; y: number; r: number; dx: number; dy: number; color: string }[] = []
    const colors = ['#0080FF', '#00FF80', '#FF8000', '#FF0080', '#8000FF']

    for (let i = 0; i < 50; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 30 + 10,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let animationId: number

    const draw = (): void => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const b of bubbles) {
        b.x += b.dx
        b.y += b.dy

        if (b.x < -b.r) b.x = canvas.width + b.r
        if (b.x > canvas.width + b.r) b.x = -b.r
        if (b.y < -b.r) b.y = canvas.height + b.r
        if (b.y > canvas.height + b.r) b.y = -b.r

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = b.color + '40'
        ctx.fill()
        ctx.strokeStyle = b.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Highlight
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = b.color + '80'
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return <Canvas ref={canvasRef} />
}

// XP Logo floating screensaver
const LogoSaver: React.FC = (): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let x = canvas.width / 2
    let y = canvas.height / 2
    let dx = 2
    let dy = 2
    let hue = 0

    let animationId: number

    const draw = (): void => {
      ctx.fillStyle = 'rgba(0, 0, 50, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      x += dx
      y += dy
      hue += 0.5

      if (x < 50 || x > canvas.width - 50) dx *= -1
      if (y < 50 || y > canvas.height - 50) dy *= -1

      // Draw XP-style window
      ctx.save()
      ctx.translate(x, y)

      // Window body
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
      ctx.fillRect(-40, -30, 80, 60)

      // Title bar
      ctx.fillStyle = `hsl(${hue + 30}, 80%, 60%)`
      ctx.fillRect(-40, -30, 80, 20)

      // Window content lines
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillRect(-30, 0, 60, 4)
      ctx.fillRect(-30, 10, 40, 4)
      ctx.fillRect(-30, 20, 50, 4)

      ctx.restore()

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return <Canvas ref={canvasRef} />
}

// Black screensaver (simple)
const BlackSaver: React.FC = (): React.JSX.Element => {
  return <BlackScreen />
}

export const ScreenSaver: React.FC<ScreenSaverProps> = ({
  type,
  onActivity
}): React.JSX.Element => {
  useEffect(() => {
    const handleActivity = (): void => {
      onActivity()
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [onActivity])

  if (type === 'nenhum') return <></>

  return (
    <ScreenSaverOverlay>
      {type === 'matrix' && <MatrixSaver />}
      {type === 'stars' && <StarsSaver />}
      {type === 'bubbles' && <BubblesSaver />}
      {type === 'logo' && <LogoSaver />}
      {type === 'black' && <BlackSaver />}
      <Hint>Mova o mouse ou pressione qualquer tecla para sair</Hint>
    </ScreenSaverOverlay>
  )
}

const ScreenSaverOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  cursor: none;
`

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`

const BlackScreen = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
`

const Hint = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Tahoma', sans-serif;
  font-size: 12px;
  pointer-events: none;
`

export default ScreenSaver

import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type Difficulty = 'fácil' | 'médio' | 'difícil' | 'impossível'

interface GameState {
  playerY: number
  botY: number
  ballX: number
  ballY: number
  ballSpeedX: number
  ballSpeedY: number
  playerScore: number
  botScore: number
  paused: boolean
}

const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 12
const BALL_SIZE = 10
const GAME_WIDTH = 640
const GAME_HEIGHT = 400
const PADDLE_SPEED = 6

const BOT_SPEEDS: Record<Difficulty, number> = {
  fácil: 3,
  médio: 5,
  difícil: 7,
  impossível: 9
}

export const Pong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [difficulty, setDifficulty] = useState<Difficulty>('médio')
  const [showMenu, setShowMenu] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)

  const gameRef = useRef<GameState>({
    playerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    botY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT / 2,
    ballSpeedX: 5,
    ballSpeedY: 3,
    playerScore: 0,
    botScore: 0,
    paused: false
  })

  const keysRef = useRef<{ up: boolean; down: boolean }>({ up: false, down: false })

  const resetBall = useCallback(() => {
    const game = gameRef.current
    game.ballX = GAME_WIDTH / 2
    game.ballY = GAME_HEIGHT / 2
    game.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 2)
    game.ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2)
  }, [])

  const update = useCallback(() => {
    const game = gameRef.current
    if (game.paused) return

    // Player movement
    if (keysRef.current.up && game.playerY > 0) {
      game.playerY -= PADDLE_SPEED
    }
    if (keysRef.current.down && game.playerY < GAME_HEIGHT - PADDLE_HEIGHT) {
      game.playerY += PADDLE_SPEED
    }

    // Bot AI
    const botSpeed = BOT_SPEEDS[difficulty]
    const botCenter = game.botY + PADDLE_HEIGHT / 2
    const ballCenter = game.ballY

    // Adicionar delay/reação baseado na dificuldade
    const reactionDelay = difficulty === 'fácil' ? 30 : difficulty === 'médio' ? 20 : difficulty === 'difícil' ? 10 : 5
    const shouldMove = Math.random() * 100 > reactionDelay

    if (shouldMove) {
      if (botCenter < ballCenter - 10 && game.botY < GAME_HEIGHT - PADDLE_HEIGHT) {
        game.botY += botSpeed
      } else if (botCenter > ballCenter + 10 && game.botY > 0) {
        game.botY -= botSpeed
      }
    }

    // Ball movement
    game.ballX += game.ballSpeedX
    game.ballY += game.ballSpeedY

    // Ball collision with top/bottom
    if (game.ballY <= 0 || game.ballY >= GAME_HEIGHT - BALL_SIZE) {
      game.ballSpeedY *= -1
    }

    // Ball collision with paddles
    // Player paddle
    if (
      game.ballX <= PADDLE_WIDTH + 10 &&
      game.ballY >= game.playerY &&
      game.ballY <= game.playerY + PADDLE_HEIGHT &&
      game.ballSpeedX < 0
    ) {
      game.ballSpeedX *= -1.1 // Increase speed slightly
      // Add angle based on hit position
      const hitPos = (game.ballY - game.playerY) / PADDLE_HEIGHT
      game.ballSpeedY = (hitPos - 0.5) * 8
    }

    // Bot paddle
    if (
      game.ballX >= GAME_WIDTH - PADDLE_WIDTH - 10 - BALL_SIZE &&
      game.ballY >= game.botY &&
      game.ballY <= game.botY + PADDLE_HEIGHT &&
      game.ballSpeedX > 0
    ) {
      game.ballSpeedX *= -1.1
      const hitPos = (game.ballY - game.botY) / PADDLE_HEIGHT
      game.ballSpeedY = (hitPos - 0.5) * 8
    }

    // Scoring
    if (game.ballX < 0) {
      game.botScore++
      if (game.botScore >= 10) {
        setWinner('Bot venceu!')
        setShowMenu(true)
        game.paused = true
      }
      resetBall()
    } else if (game.ballX > GAME_WIDTH) {
      game.playerScore++
      if (game.playerScore >= 10) {
        setWinner('Você venceu!')
        setShowMenu(true)
        game.paused = true
      }
      resetBall()
    }
  }, [difficulty, resetBall])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const game = gameRef.current

    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // Draw center line
    ctx.strokeStyle = '#444'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(GAME_WIDTH / 2, 0)
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = '#0f0'
    ctx.fillRect(10, game.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.fillStyle = '#f00'
    ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH - 10, game.botY, PADDLE_WIDTH, PADDLE_HEIGHT)

    // Draw ball
    ctx.fillStyle = '#fff'
    ctx.fillRect(game.ballX - BALL_SIZE / 2, game.ballY - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE)

    // Draw scores
    ctx.fillStyle = '#fff'
    ctx.font = '24px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(game.playerScore.toString(), GAME_WIDTH / 4, 30)
    ctx.fillText(game.botScore.toString(), (GAME_WIDTH * 3) / 4, 30)

    // Draw controls hint
    ctx.font = '12px monospace'
    ctx.fillStyle = '#888'
    ctx.fillText('↑ ↓ ou W S para mover', GAME_WIDTH / 2, GAME_HEIGHT - 10)
  }, [])

  const gameLoop = useCallback(() => {
    update()
    draw()
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [update, draw])

  useEffect(() => {
    if (!showMenu) {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop, showMenu])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        keysRef.current.up = true
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        keysRef.current.down = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        keysRef.current.up = false
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        keysRef.current.down = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff)
    setShowMenu(false)
    setWinner(null)
    gameRef.current = {
      playerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      botY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: GAME_WIDTH / 2,
      ballY: GAME_HEIGHT / 2,
      ballSpeedX: 5,
      ballSpeedY: 3,
      playerScore: 0,
      botScore: 0,
      paused: false
    }
  }

  return (
    <Root>
      <Canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
      />
      {showMenu && (
        <Menu>
          <MenuTitle>Pong XP</MenuTitle>
          {winner && <WinnerText>{winner}</WinnerText>}
          <MenuText>Escolha a dificuldade:</MenuText>
          <ButtonGroup>
            <DiffButton onClick={() => startGame('fácil')}>Fácil</DiffButton>
            <DiffButton onClick={() => startGame('médio')}>Médio</DiffButton>
            <DiffButton onClick={() => startGame('difícil')}>Difícil</DiffButton>
            <DiffButton onClick={() => startGame('impossível')}>Impossível</DiffButton>
          </ButtonGroup>
          <Instructions>
            Use ↑ ↓ ou W S para mover sua raquete (verde).<br />
            Primeiro a fazer 10 pontos vence!
          </Instructions>
        </Menu>
      )}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #000;
  position: relative;
`

const Canvas = styled.canvas`
  border: 2px solid #333;
`

const Menu = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

const MenuTitle = styled.h1`
  color: #0f0;
  font-family: 'Courier New', monospace;
  font-size: 36px;
  margin: 0;
  text-shadow: 0 0 10px #0f0;
`

const WinnerText = styled.div`
  color: #ff0;
  font-family: 'Courier New', monospace;
  font-size: 24px;
`

const MenuText = styled.p`
  color: #fff;
  font-family: 'Courier New', monospace;
  margin: 0;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`

const DiffButton = styled.button`
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  background: #0f0;
  color: #000;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #0c0;
    transform: scale(1.05);
  }
`

const Instructions = styled.p`
  color: #888;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-align: center;
  margin-top: 16px;
`

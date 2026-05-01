import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import open1 from '../../assets/minesweeper/open1.png'
import open2 from '../../assets/minesweeper/open2.png'
import open3 from '../../assets/minesweeper/open3.png'
import open4 from '../../assets/minesweeper/open4.png'
import open5 from '../../assets/minesweeper/open5.png'
import open6 from '../../assets/minesweeper/open6.png'
import open7 from '../../assets/minesweeper/open7.png'
import open8 from '../../assets/minesweeper/open8.png'
import opened from '../../assets/minesweeper/checked.png'
import unopened from '../../assets/minesweeper/mine-ceil.png'
import mineDeath from '../../assets/minesweeper/mine-death.png'
import flag from '../../assets/minesweeper/flag.png'
import q from '../../assets/minesweeper/question.png'
import smile from '../../assets/minesweeper/smile.png'
import dead from '../../assets/minesweeper/dead.png'
import win from '../../assets/minesweeper/win.png'
import ohh from '../../assets/minesweeper/ohh.png'
import d0 from '../../assets/minesweeper/digit0.png'
import d1 from '../../assets/minesweeper/digit1.png'
import d2 from '../../assets/minesweeper/digit2.png'
import d3 from '../../assets/minesweeper/digit3.png'
import d4 from '../../assets/minesweeper/digit4.png'
import d5 from '../../assets/minesweeper/digit5.png'
import d6 from '../../assets/minesweeper/digit6.png'
import d7 from '../../assets/minesweeper/digit7.png'
import d8 from '../../assets/minesweeper/digit8.png'
import d9 from '../../assets/minesweeper/digit9.png'
import dMinus from '../../assets/minesweeper/digit-.png'

const DIGITS = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9]
const NUMBERS = [opened, open1, open2, open3, open4, open5, open6, open7, open8]

type Cell = {
  mine: boolean
  revealed: boolean
  flag: 0 | 1 | 2
  adj: number
}

type Face = 'smile' | 'ohh' | 'dead' | 'win'

interface Level {
  rows: number
  cols: number
  mines: number
}
const LEVELS: Record<string, Level> = {
  Fácil: { rows: 9, cols: 9, mines: 10 },
  Médio: { rows: 16, cols: 16, mines: 40 },
  Difícil: { rows: 16, cols: 30, mines: 99 }
}

function createBoard(level: Level, safe: { r: number; c: number }): Cell[][] {
  const grid: Cell[][] = Array.from({ length: level.rows }, () =>
    Array.from({ length: level.cols }, () => ({ mine: false, revealed: false, flag: 0, adj: 0 } as Cell))
  )
  let placed = 0
  while (placed < level.mines) {
    const r = Math.floor(Math.random() * level.rows)
    const c = Math.floor(Math.random() * level.cols)
    if (grid[r][c].mine) continue
    if (Math.abs(r - safe.r) <= 1 && Math.abs(c - safe.c) <= 1) continue
    grid[r][c].mine = true
    placed++
  }
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      if (grid[r][c].mine) continue
      let n = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols && grid[nr][nc].mine) n++
        }
      }
      grid[r][c].adj = n
    }
  }
  return grid
}

export const Minesweeper: React.FC = () => {
  const [levelName, setLevelName] = useState<keyof typeof LEVELS>('Fácil')
  const level = LEVELS[levelName]
  const [grid, setGrid] = useState<Cell[][] | null>(null)
  const [flags, setFlags] = useState(0)
  const [face, setFace] = useState<Face>('smile')
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  const reset = useCallback(() => {
    setGrid(null)
    setFlags(0)
    setTime(0)
    setFace('smile')
    setRunning(false)
  }, [])

  useEffect(() => {
    reset()
  }, [levelName, reset])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setTime((t) => Math.min(999, t + 1)), 1000)
    return () => clearInterval(id)
  }, [running])

  const reveal = (r: number, c: number, base: Cell[][]): Cell[][] => {
    if (base[r][c].revealed || base[r][c].flag === 1) return base
    const stack = [[r, c]]
    const next = base.map((row) => row.map((cell) => ({ ...cell })))
    while (stack.length) {
      const [y, x] = stack.pop()!
      const cell = next[y][x]
      if (cell.revealed || cell.flag === 1) continue
      cell.revealed = true
      if (cell.adj === 0 && !cell.mine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = y + dr
            const nc = x + dc
            if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols && !next[nr][nc].revealed) {
              stack.push([nr, nc])
            }
          }
        }
      }
    }
    return next
  }

  const handleClick = (r: number, c: number): void => {
    if (face === 'dead' || face === 'win') return
    let next: Cell[][]
    if (!grid) {
      next = createBoard(level, { r, c })
      setRunning(true)
    } else {
      next = grid
    }
    if (next[r][c].flag === 1) return
    if (next[r][c].mine) {
      next = next.map((row) => row.map((cell) => ({ ...cell })))
      next[r][c].revealed = true
      for (let y = 0; y < level.rows; y++) {
        for (let x = 0; x < level.cols; x++) {
          if (next[y][x].mine) next[y][x].revealed = true
        }
      }
      setGrid(next)
      setFace('dead')
      setRunning(false)
      return
    }
    next = reveal(r, c, next)
    let won = true
    for (let y = 0; y < level.rows; y++) {
      for (let x = 0; x < level.cols; x++) {
        if (!next[y][x].mine && !next[y][x].revealed) won = false
      }
    }
    setGrid(next)
    if (won) {
      setFace('win')
      setRunning(false)
    }
  }

  const handleRight = (e: React.MouseEvent, r: number, c: number): void => {
    e.preventDefault()
    if (!grid || face === 'dead' || face === 'win') return
    const next = grid.map((row) => row.map((cell) => ({ ...cell })))
    const cell = next[r][c]
    if (cell.revealed) return
    cell.flag = ((cell.flag + 1) % 3) as Cell['flag']
    let f = 0
    next.forEach((row) => row.forEach((x) => x.flag === 1 && f++))
    setFlags(f)
    setGrid(next)
  }

  const display = useMemo(() => grid ?? Array.from({ length: level.rows }, () =>
    Array.from({ length: level.cols }, () => ({ mine: false, revealed: false, flag: 0, adj: 0 } as Cell))
  ), [grid, level])

  const remaining = level.mines - flags
  const faceSrc = face === 'smile' ? smile : face === 'ohh' ? ohh : face === 'dead' ? dead : win

  return (
    <Root>
      <MenuBar>
        <MenuItemBtn>
          <u>J</u>ogo
        </MenuItemBtn>
        {(['Fácil', 'Médio', 'Difícil'] as const).map((l) => (
          <LevelBtn key={l} $active={levelName === l} onClick={() => setLevelName(l)}>
            {l}
          </LevelBtn>
        ))}
        <MenuItemBtn onClick={reset}>Novo</MenuItemBtn>
      </MenuBar>
      <Frame>
        <Header>
          <DigitBox>
            {String(remaining).padStart(3, '0').split('').map((d, i) => (
              <img key={i} src={d === '-' ? dMinus : DIGITS[parseInt(d)]} alt="" />
            ))}
          </DigitBox>
          <FaceBtn
            onMouseDown={() => face !== 'dead' && face !== 'win' && setFace('ohh')}
            onMouseUp={() => running && setFace('smile')}
            onClick={reset}
          >
            <img src={faceSrc} alt="" />
          </FaceBtn>
          <DigitBox>
            {String(time).padStart(3, '0').split('').map((d, i) => (
              <img key={i} src={DIGITS[parseInt(d)]} alt="" />
            ))}
          </DigitBox>
        </Header>
        <Grid $cols={level.cols}>
          {display.map((row, r) =>
            row.map((cell, c) => (
              <Cel
                key={`${r}-${c}`}
                onMouseDown={(e) => e.button === 0 && face !== 'dead' && face !== 'win' && setFace('ohh')}
                onMouseUp={() => face === 'ohh' && setFace('smile')}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRight(e, r, c)}
              >
                {!cell.revealed && cell.flag === 0 && <img src={unopened} alt="" />}
                {!cell.revealed && cell.flag === 1 && <img src={flag} alt="" />}
                {!cell.revealed && cell.flag === 2 && <img src={q} alt="" />}
                {cell.revealed && cell.mine && <img src={mineDeath} alt="" />}
                {cell.revealed && !cell.mine && <img src={NUMBERS[cell.adj]} alt="" />}
              </Cel>
            ))
          )}
        </Grid>
      </Frame>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: #ece9d8;
  padding: 6px;
  overflow: auto;
`

const MenuBar = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px 2px;
  font-size: 11px;
  background: #ece9d8;
`

const MenuItemBtn = styled.button`
  background: transparent;
  border: none;
  padding: 2px 6px;
  cursor: pointer;
  &:hover { background: #316ac5; color: #fff; }
`

const LevelBtn = styled.button<{ $active: boolean }>`
  background: ${(p) => (p.$active ? '#316ac5' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#000')};
  border: none;
  padding: 2px 6px;
  cursor: pointer;
  &:hover { background: #316ac5; color: #fff; }
`

const Frame = styled.div`
  background: #c0c0c0;
  padding: 6px;
  border: 3px solid;
  border-color: #fff #808080 #808080 #fff;
  display: inline-block;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 6px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  margin-bottom: 6px;
`

const DigitBox = styled.div`
  display: flex;
  background: #000;
  padding: 1px;
  img { width: 13px; height: 23px; display: block; }
`

const FaceBtn = styled.button`
  width: 28px;
  height: 28px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  img { width: 20px; height: 20px; }
  &:active {
    border-color: #808080 #fff #fff #808080;
  }
`

const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols}, 16px);
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
`

const Cel = styled.div`
  width: 16px;
  height: 16px;
  img { width: 16px; height: 16px; display: block; image-rendering: pixelated; }
  cursor: default;
`

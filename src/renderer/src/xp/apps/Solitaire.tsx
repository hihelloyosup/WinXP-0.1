import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

type Suit = '♠' | '♥' | '♦' | '♣'
type Card = { suit: Suit; rank: number; faceUp: boolean; id: number }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RED = new Set<Suit>(['♥', '♦'])

function rankLabel(r: number): string {
  if (r === 1) return 'A'
  if (r === 11) return 'J'
  if (r === 12) return 'Q'
  if (r === 13) return 'K'
  return String(r)
}

function newDeck(): Card[] {
  let id = 0
  const d: Card[] = []
  for (const s of SUITS) {
    for (let r = 1; r <= 13; r++) {
      d.push({ suit: s, rank: r, faceUp: false, id: id++ })
    }
  }
  return d
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface GameState {
  tableau: Card[][]
  foundation: Card[][]
  stock: Card[]
  waste: Card[]
}

function deal(): GameState {
  const deck = shuffle(newDeck())
  const tableau: Card[][] = [[], [], [], [], [], [], []]
  for (let pile = 0; pile < 7; pile++) {
    for (let i = pile; i < 7; i++) {
      const c = deck.pop()!
      c.faceUp = i === pile
      tableau[i].push(c)
    }
  }
  return {
    tableau,
    foundation: [[], [], [], []],
    stock: deck.map((c) => ({ ...c, faceUp: false })),
    waste: []
  }
}

export const Solitaire: React.FC = () => {
  const [g, setG] = useState<GameState>(() => deal())
  const [selection, setSelection] = useState<{ from: 'tab' | 'waste' | 'found'; col: number; idx: number } | null>(null)

  const drawStock = (): void => {
    setG((s) => {
      if (s.stock.length === 0) {
        return { ...s, stock: s.waste.reverse().map((c) => ({ ...c, faceUp: false })), waste: [] }
      }
      const c = { ...s.stock[s.stock.length - 1], faceUp: true }
      return { ...s, stock: s.stock.slice(0, -1), waste: [...s.waste, c] }
    })
  }

  const clone = (s: GameState): GameState => ({
    tableau: s.tableau.map((p) => p.map((c) => ({ ...c }))),
    foundation: s.foundation.map((p) => p.map((c) => ({ ...c }))),
    stock: s.stock.map((c) => ({ ...c })),
    waste: s.waste.map((c) => ({ ...c }))
  })

  const canStackTab = (top: Card | undefined, moving: Card): boolean => {
    if (!top) return moving.rank === 13
    if (!top.faceUp) return false
    if (RED.has(top.suit) === RED.has(moving.suit)) return false
    return top.rank === moving.rank + 1
  }

  const canStackFound = (top: Card | undefined, moving: Card): boolean => {
    if (!top) return moving.rank === 1
    return top.suit === moving.suit && top.rank === moving.rank - 1
  }

  const tryMove = (target: { kind: 'tab' | 'found'; col: number }): void => {
    if (!selection) return
    setG((s) => {
      const ns = clone(s)
      let moving: Card[]
      if (selection.from === 'waste') {
        moving = ns.waste.slice(-1)
      } else if (selection.from === 'tab') {
        moving = ns.tableau[selection.col].slice(selection.idx)
      } else {
        moving = ns.foundation[selection.col].slice(-1)
      }
      if (moving.length === 0) return s
      if (target.kind === 'found') {
        if (moving.length !== 1) return s
        if (!canStackFound(ns.foundation[target.col].slice(-1)[0], moving[0])) return s
      } else {
        if (!canStackTab(ns.tableau[target.col].slice(-1)[0], moving[0])) return s
      }
      // commit
      if (selection.from === 'waste') ns.waste = ns.waste.slice(0, -1)
      if (selection.from === 'tab') {
        ns.tableau[selection.col] = ns.tableau[selection.col].slice(0, selection.idx)
        const last = ns.tableau[selection.col].slice(-1)[0]
        if (last && !last.faceUp) last.faceUp = true
      }
      if (selection.from === 'found') ns.foundation[selection.col] = ns.foundation[selection.col].slice(0, -1)
      if (target.kind === 'tab') ns.tableau[target.col] = [...ns.tableau[target.col], ...moving]
      else ns.foundation[target.col] = [...ns.foundation[target.col], ...moving]
      return ns
    })
    setSelection(null)
  }

  const pickFromTab = (col: number, idx: number): void => {
    const pile = g.tableau[col]
    if (pile.length === 0 || !pile[idx].faceUp) return
    if (selection && selection.from === 'tab' && selection.col === col && selection.idx === idx) {
      setSelection(null)
      return
    }
    if (selection) {
      tryMove({ kind: 'tab', col })
      return
    }
    setSelection({ from: 'tab', col, idx })
  }

  const pickWaste = (): void => {
    if (g.waste.length === 0) return
    if (selection && selection.from === 'waste') {
      setSelection(null)
      return
    }
    setSelection({ from: 'waste', col: 0, idx: g.waste.length - 1 })
  }

  const isSelected = (from: 'tab' | 'waste' | 'found', col: number, idx: number): boolean =>
    !!selection && selection.from === from && selection.col === col && selection.idx <= idx

  const won = useMemo(() => g.foundation.every((f) => f.length === 13), [g.foundation])

  return (
    <Root>
      <TopRow>
        <StockArea onClick={drawStock}>
          {g.stock.length > 0 ? <CardBack /> : <EmptySlot>↻</EmptySlot>}
        </StockArea>
        <WasteArea>
          {g.waste.slice(-1).map((c) => (
            <CardFace
              key={c.id}
              onClick={pickWaste}
              $selected={isSelected('waste', 0, g.waste.length - 1)}
              $red={RED.has(c.suit)}
            >
              <small>{rankLabel(c.rank)}</small>
              <big>{c.suit}</big>
            </CardFace>
          ))}
          {g.waste.length === 0 && <EmptySlot />}
        </WasteArea>
        <Spacer />
        {g.foundation.map((pile, col) => (
          <FoundationSlot key={col} onClick={() => selection ? tryMove({ kind: 'found', col }) : null}>
            {pile.length === 0 ? (
              <EmptySlot>{['♠', '♥', '♦', '♣'][col]}</EmptySlot>
            ) : (
              <CardFace $red={RED.has(pile[pile.length - 1].suit)}>
                <small>{rankLabel(pile[pile.length - 1].rank)}</small>
                <big>{pile[pile.length - 1].suit}</big>
              </CardFace>
            )}
          </FoundationSlot>
        ))}
      </TopRow>
      <Tableau>
        {g.tableau.map((pile, col) => (
          <Column key={col} onClick={() => selection && pile.length === 0 ? tryMove({ kind: 'tab', col }) : null}>
            {pile.length === 0 && <EmptyCol />}
            {pile.map((c, idx) => (
              <Stacked key={c.id} $offset={idx}>
                {c.faceUp ? (
                  <CardFace
                    onClick={(e) => { e.stopPropagation(); pickFromTab(col, idx) }}
                    $selected={isSelected('tab', col, idx)}
                    $red={RED.has(c.suit)}
                  >
                    <small>{rankLabel(c.rank)}</small>
                    <big>{c.suit}</big>
                  </CardFace>
                ) : (
                  <CardBack />
                )}
              </Stacked>
            ))}
          </Column>
        ))}
      </Tableau>
      {won && <WinBanner>Você venceu! 🎉</WinBanner>}
      <Menu>
        <button onClick={() => { setG(deal()); setSelection(null) }}>Nova partida</button>
      </Menu>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: #008000;
  padding: 10px;
  overflow: auto;
  position: relative;
`

const TopRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`

const StockArea = styled.div`
  width: 60px;
  height: 86px;
  cursor: pointer;
`

const WasteArea = styled.div`
  width: 60px;
  height: 86px;
`

const Spacer = styled.div`
  flex: 1;
`

const FoundationSlot = styled.div`
  width: 60px;
  height: 86px;
  cursor: pointer;
`

const Tableau = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 66px);
  gap: 8px;
  margin-top: 12px;
`

const Column = styled.div`
  position: relative;
  min-height: 110px;
`

const Stacked = styled.div<{ $offset: number }>`
  position: absolute;
  top: ${(p) => p.$offset * 18}px;
  left: 0;
`

const cardBase = `
  width: 60px;
  height: 86px;
  background: #fff;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Times New Roman', serif;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: pointer;
`

const CardFace = styled.div<{ $red?: boolean; $selected?: boolean }>`
  ${cardBase}
  color: ${(p) => (p.$red ? '#c00' : '#000')};
  outline: ${(p) => (p.$selected ? '2px solid #ffd700' : 'none')};
  small { font-size: 12px; font-weight: bold; }
  big { font-size: 22px; align-self: flex-end; }
`

const CardBack = styled.div`
  ${cardBase}
  background: repeating-linear-gradient(45deg, #004080 0 4px, #0058ee 4px 8px);
`

const EmptySlot = styled.div`
  ${cardBase}
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

const EmptyCol = styled.div`
  ${cardBase}
  background: rgba(255,255,255,0.08);
`

const Menu = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;
  button {
    padding: 4px 10px;
    border: 1px solid #003c74;
    background: #ece9d8;
    cursor: pointer;
    border-radius: 3px;
  }
`

const WinBanner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border: 2px solid #fc0;
  padding: 20px 30px;
  border-radius: 6px;
  font-size: 20px;
  color: #000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
`

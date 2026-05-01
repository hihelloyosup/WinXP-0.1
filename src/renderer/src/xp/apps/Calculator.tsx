import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { XpMenuBar, XpMenuItem } from '../ui'

type Op = '+' | '-' | '×' | '÷' | null

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [justEvaluated, setJustEvaluated] = useState(false)

  const pushDigit = useCallback(
    (d: string) => {
      setJustEvaluated(false)
      setDisplay((cur) => {
        if (justEvaluated || cur === '0') return d === '.' ? '0.' : d
        if (d === '.' && cur.includes('.')) return cur
        return cur + d
      })
    },
    [justEvaluated]
  )

  const apply = (a: number, b: number, o: Op): number => {
    switch (o) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b === 0 ? NaN : a / b
      default: return b
    }
  }

  const setOperator = (nextOp: Op): void => {
    const cur = parseFloat(display)
    if (prev != null && op && !justEvaluated) {
      const res = apply(prev, cur, op)
      setPrev(res)
      setDisplay(String(res))
    } else {
      setPrev(cur)
    }
    setOp(nextOp)
    setJustEvaluated(true)
  }

  const equals = (): void => {
    if (prev == null || op == null) return
    const cur = parseFloat(display)
    const res = apply(prev, cur, op)
    setDisplay(Number.isFinite(res) ? String(res) : 'Erro')
    setPrev(null)
    setOp(null)
    setJustEvaluated(true)
  }

  const clear = (): void => {
    setDisplay('0')
    setPrev(null)
    setOp(null)
    setJustEvaluated(false)
  }

  const backspace = (): void => {
    setDisplay((cur) => (cur.length > 1 ? cur.slice(0, -1) : '0'))
  }

  const sign = (): void => {
    setDisplay((cur) => (cur.startsWith('-') ? cur.slice(1) : cur === '0' ? cur : '-' + cur))
  }

  return (
    <Root>
      <XpMenuBar>
        <XpMenuItem><u>E</u>ditar</XpMenuItem>
        <XpMenuItem><u>E</u>xibir</XpMenuItem>
        <XpMenuItem>Aj<u>u</u>da</XpMenuItem>
      </XpMenuBar>
      <Screen>{display}</Screen>
      <Pad>
        <Row>
          <Btn onClick={clear} $bg="#b44">MC</Btn>
          <Btn onClick={clear} $bg="#b44">MR</Btn>
          <Btn onClick={clear} $bg="#b44">MS</Btn>
          <Btn onClick={clear} $bg="#b44">M+</Btn>
          <Btn onClick={clear} $bg="#b44">M-</Btn>
        </Row>
        <Row>
          <Btn onClick={backspace} $bg="#c44">Back</Btn>
          <Btn onClick={clear} $bg="#c44">CE</Btn>
          <Btn onClick={clear} $bg="#c44">C</Btn>
          <Btn onClick={sign}>±</Btn>
          <Btn onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))}>√</Btn>
        </Row>
        <Row>
          <Btn onClick={() => pushDigit('7')}>7</Btn>
          <Btn onClick={() => pushDigit('8')}>8</Btn>
          <Btn onClick={() => pushDigit('9')}>9</Btn>
          <Btn onClick={() => setOperator('÷')} $bg="#d77200">÷</Btn>
          <Btn onClick={() => setDisplay(String(1 / parseFloat(display)))}>1/x</Btn>
        </Row>
        <Row>
          <Btn onClick={() => pushDigit('4')}>4</Btn>
          <Btn onClick={() => pushDigit('5')}>5</Btn>
          <Btn onClick={() => pushDigit('6')}>6</Btn>
          <Btn onClick={() => setOperator('×')} $bg="#d77200">×</Btn>
          <Btn onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</Btn>
        </Row>
        <Row>
          <Btn onClick={() => pushDigit('1')}>1</Btn>
          <Btn onClick={() => pushDigit('2')}>2</Btn>
          <Btn onClick={() => pushDigit('3')}>3</Btn>
          <Btn onClick={() => setOperator('-')} $bg="#d77200">-</Btn>
          <Btn onClick={equals} $bg="#d77200" $wide>=</Btn>
        </Row>
        <Row>
          <Btn onClick={() => pushDigit('0')} $wide>0</Btn>
          <Btn onClick={() => pushDigit('.')}>.</Btn>
          <Btn onClick={() => setOperator('+')} $bg="#d77200">+</Btn>
        </Row>
      </Pad>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ece9d8;
  padding: 4px;
`

const Screen = styled.div`
  background: #fff;
  border: 1px solid #7f9db9;
  box-shadow: inset 1px 1px 0 #999;
  margin: 6px 2px;
  padding: 4px 6px;
  text-align: right;
  font-family: 'Digital', 'Courier New', monospace;
  font-size: 20px;
  min-height: 26px;
  overflow: hidden;
  color: #000;
`

const Pad = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 2px;
`

const Row = styled.div`
  display: flex;
  gap: 4px;
`

const Btn = styled.button<{ $bg?: string; $wide?: boolean }>`
  flex: ${(p) => (p.$wide ? 2 : 1)};
  padding: 6px 0;
  background: ${(p) => p.$bg ?? '#ece9d8'};
  color: ${(p) => (p.$bg ? '#fff' : '#000')};
  border: 1px solid #7f9db9;
  border-radius: 2px;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  &:hover { filter: brightness(1.1); }
  &:active { filter: brightness(0.9); }
`

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

interface Props {
  onComplete: () => void
}

const loadingLines = [
  '[1/12] Verificando registro de sistema...',
  '[2/12] Reparando hive do registro...',
  '[3/12] Recuperando configurações de sistema...',
  '[4/12] Carregando backup de drivers...',
  '[5/12] Restaurando chaves do registro...',
  '[6/12] Verificando integridade de arquivos do sistema...',
  '[7/12] Recarregando configurações de hardware...',
  '[8/12] Recuperando perfis de usuário...',
  '[9/12] Atualizando cache do sistema...',
  '[10/12] Aplicando configurações de última sessão válida...',
  '[11/12] Finalizando restauração...',
  '[12/12] Inicializando Windows...'
]

export const LastGoodLoading: React.FC<Props> = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0)
  const [allLines, setAllLines] = useState<string[]>([])

  useEffect(() => {
    if (currentLine < loadingLines.length) {
      const timer = setTimeout(() => {
        setAllLines((prev) => [...prev, loadingLines[currentLine]])
        setCurrentLine((prev) => prev + 1)
      }, 600 + Math.random() * 400)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onComplete, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentLine, onComplete])

  return (
    <Root>
      <Container>
        <Header>Restaurando Última Configuração Válida</Header>
        <LinesContainer>
          {allLines.map((line, i) => (
            <Line key={i}>{line}</Line>
          ))}
          {currentLine < loadingLines.length && <Cursor>_</Cursor>}
        </LinesContainer>
        <ProgressBar>
          <ProgressFill style={{ width: `${((currentLine / loadingLines.length) * 100)}%` }} />
        </ProgressBar>
      </Container>
    </Root>
  )
}

const Root = styled.div`
  position: fixed;
  inset: 0;
  background-color: #000;
  color: #00ff00;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  width: 800px;
  max-width: 90vw;
  border: 1px solid #008800;
  padding: 20px;
`

const Header = styled.h1`
  font-size: 18px;
  margin: 0 0 20px 0;
  text-align: center;
  color: #ffffff;
`

const LinesContainer = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Line = styled.div`
  white-space: pre;
`

const Cursor = styled.div`
  animation: blink 0.7s infinite;
  
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`

const ProgressBar = styled.div`
  margin-top: 20px;
  height: 20px;
  background-color: #003300;
  border: 1px solid #008800;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  background-color: #00ff00;
  transition: width 0.3s ease;
`

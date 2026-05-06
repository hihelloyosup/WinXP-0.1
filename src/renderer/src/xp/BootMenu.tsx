import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import type { BootOption, DebugOption } from './types'

interface Props {
  onSelect: (option: BootOption, debugOption?: DebugOption) => void
}

const mainOptions: { id: BootOption; label: string }[] = [
  { id: 'safe', label: 'Modo Seguro' },
  { id: 'safe-network', label: 'Modo Seguro com Rede' },
  { id: 'safe-cmd', label: 'Modo Seguro com Prompt de comando' },
  { id: 'log', label: 'Ativar Log de Inicialização' },
  { id: 'vga', label: 'Ativar Modo VGA' },
  { id: 'last-good', label: 'Última Configuração Válida (Avançado)' },
  { id: 'dsrm', label: 'Modo de Restauração do Windows' },
  { id: 'debug', label: 'Modo de Depuração' },
  { id: 'restore', label: 'Restaurar Sistema (Resetar e perder dados corrompidos)' },
  { id: 'normal', label: 'Iniciar Normalmente' }
]

const debugOptions: { id: DebugOption; label: string; desc: string }[] = [
  { id: 'no-icons', label: 'Modo Sem Ícones', desc: 'Remove todos os ícones da área de trabalho' },
  { id: 'inverted-colors', label: 'Cores Invertidas', desc: 'Inverte todas as cores do sistema' },
  { id: 'random-icons', label: 'Ícones Aleatórios', desc: 'Troca os ícones do sistema aleatoriamente' },
  { id: 'glitch-mode', label: 'Modo Glitch', desc: 'Aplica efeitos de glitch na interface' },
  { id: 'slow-motion', label: 'Câmera Lenta', desc: 'Torna todas as animações muito lentas' }
]

export const BootMenu: React.FC<Props> = ({ onSelect }) => {
  const [selectedMainIndex, setSelectedMainIndex] = useState(mainOptions.length - 1)
  const [showDebugMenu, setShowDebugMenu] = useState(false)
  const [selectedDebugIndex, setSelectedDebugIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showDebugMenu) {
        if (e.key === 'ArrowUp') {
          setSelectedDebugIndex((prev) => (prev > 0 ? prev - 1 : debugOptions.length - 1))
        } else if (e.key === 'ArrowDown') {
          setSelectedDebugIndex((prev) => (prev < debugOptions.length - 1 ? prev + 1 : 0))
        } else if (e.key === 'Enter') {
          onSelect('debug', debugOptions[selectedDebugIndex].id)
        } else if (e.key === 'Escape') {
          setShowDebugMenu(false)
        }
      } else {
        if (e.key === 'ArrowUp') {
          setSelectedMainIndex((prev) => (prev > 0 ? prev - 1 : mainOptions.length - 1))
        } else if (e.key === 'ArrowDown') {
          setSelectedMainIndex((prev) => (prev < mainOptions.length - 1 ? prev + 1 : 0))
        } else if (e.key === 'Enter') {
          if (mainOptions[selectedMainIndex].id === 'debug') {
            setShowDebugMenu(true)
          } else {
            onSelect(mainOptions[selectedMainIndex].id)
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMainIndex, selectedDebugIndex, showDebugMenu, onSelect])

  return (
    <Root>
      <Header>Menu de Opções Avançadas do Windows XP</Header>
      <Content>
        <p>Selecione uma opção avançada para: Windows XP</p>
        <p>(Use as setas para realçar a opção.)</p>
        
        {!showDebugMenu ? (
          <>
            <OptionsList>
              {mainOptions.map((opt, i) => (
                <OptionItem key={opt.id} $selected={i === selectedMainIndex}>
                  {opt.label}
                </OptionItem>
              ))}
            </OptionsList>
            <Description>
              <p>Descrição: Use as teclas de seta para cima e para baixo para mover o realce</p>
              <p>para a sua escolha. Pressione ENTER para selecionar a opção.</p>
            </Description>
          </>
        ) : (
          <>
            <OptionsList>
              {debugOptions.map((opt, i) => (
                <OptionItem key={opt.id} $selected={i === selectedDebugIndex}>
                  {opt.label}
                </OptionItem>
              ))}
            </OptionsList>
            <Description>
              <p>{debugOptions[selectedDebugIndex].desc}</p>
              <p>Pressione ENTER para confirmar ou ESC para voltar.</p>
            </Description>
          </>
        )}
      </Content>
      <Footer>
        <span>ENTER=Selecionar</span>
        {showDebugMenu && <span>ESC=Voltar</span>}
      </Footer>
    </Root>
  )
}

const Root = styled.div`
  position: fixed;
  inset: 0;
  background-color: #000;
  color: #c0c0c0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 16px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  text-align: center;
  background-color: #c0c0c0;
  color: #000;
  padding: 4px;
  margin-top: 10px;
`

const Content = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
`

const OptionsList = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const OptionItem = styled.div<{ $selected: boolean }>`
  padding: 2px 10px;
  background-color: ${(p) => (p.$selected ? '#c0c0c0' : 'transparent')};
  color: ${(p) => (p.$selected ? '#000' : '#c0c0c0')};
`

const Description = styled.div`
  margin-top: auto;
  p {
    margin: 4px 0;
  }
`

const Footer = styled.div`
  background-color: #c0c0c0;
  color: #000;
  padding: 4px 10px;
  display: flex;
  justify-content: space-between;
`

import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { XpButton, XpField } from '../ui'
import { useOpenApp, useWindows } from '../WindowSystem'
import type { AppInstance } from '../types'
import { useMsgBox } from '../XpMessageBox'

const COMMANDS: Record<string, { app: string; desc: string }> = {
  notepad: { app: 'notepad', desc: 'Bloco de Notas' },
  'notepad.exe': { app: 'notepad', desc: 'Bloco de Notas' },
  calc: { app: 'calculator', desc: 'Calculadora' },
  'calc.exe': { app: 'calculator', desc: 'Calculadora' },
  mspaint: { app: 'paint', desc: 'Paint' },
  iexplore: { app: 'ie', desc: 'Internet Explorer' },
  'iexplore.exe': { app: 'ie', desc: 'Internet Explorer' },
  winmine: { app: 'minesweeper', desc: 'Campo Minado' },
  sol: { app: 'solitaire', desc: 'Paciência' },
  wmplayer: { app: 'mediaPlayer', desc: 'Windows Media Player' },
  msn: { app: 'msn', desc: 'MSN' },
  control: { app: 'controlPanel', desc: 'Painel de Controle' },
  explorer: { app: 'myComputer', desc: 'Windows Explorer' },
  winver: { app: 'about', desc: 'Sobre o Windows' },
  regedit: { app: 'regedit', desc: 'Editor de Registro' },
  cmd: { app: 'cmd', desc: 'Prompt de comando' },
  'cmd.exe': { app: 'cmd', desc: 'Prompt de comando' },
  'wscui.cpl': { app: 'securityCenter', desc: 'Central de Segurança' },
  security: { app: 'securityCenter', desc: 'Central de Segurança' }
}

export const RunDialog: React.FC<{ instance: AppInstance }> = ({ instance }) => {
  const [text, setText] = useState('')
  const openApp = useOpenApp()
  const { close } = useWindows()
  const { showMessage } = useMsgBox()

  const run = (): void => {
    const key = text.trim().toLowerCase()
    if (key === 'ms dos' || key === 'ms-dos' || key === 'msdos') {
      window.location.hash = '#msdos'
      window.location.reload()
      return
    }
    const match = COMMANDS[key]
    if (match) {
      openApp(match.app)
      close(instance.id)
    } else {
      showMessage({
        title: 'Executar',
        message: `O Windows não pode encontrar '${text}'. Certifique-se de que o nome foi digitado corretamente e tente novamente.`,
        type: 'error'
      })
    }
  }

  return (
    <Root>
      <TopRow>
        <img src={Icon.run32} alt="" />
        <Help>
          Digite o nome de um programa, pasta, documento ou recurso da Internet e o Windows o abrirá para você.
        </Help>
      </TopRow>
      <Row>
        <label>Abrir:</label>
        <XpField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          style={{ flex: 1 }}
          autoFocus
        />
      </Row>
      <Buttons>
        <XpButton onClick={run}>OK</XpButton>
        <XpButton onClick={() => close(instance.id)}>Cancelar</XpButton>
        <XpButton onClick={() => showMessage({ title: 'Executar', message: 'Procurar: recurso não disponível nesta demo.', type: 'info' })}>Procurar...</XpButton>
      </Buttons>
      <Suggestions>
        Comandos: {Object.keys(COMMANDS).slice(0, 10).join(', ')}...
      </Suggestions>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: #ece9d8;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TopRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  img { width: 32px; height: 32px; }
`

const Help = styled.div`
  flex: 1;
  font-size: 11px;
  line-height: 1.4;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  label { font-size: 11px; }
`

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
`

const Suggestions = styled.div`
  font-size: 10px;
  color: #555;
  margin-top: 6px;
  border-top: 1px dashed #b3b3b3;
  padding-top: 6px;
`

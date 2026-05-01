import React, { useState } from 'react'
import styled from 'styled-components'
import { XpMenuBar, XpMenuItem, XpStatusBar, XpStatusField } from '../ui'

export const Notepad: React.FC = () => {
  const [text, setText] = useState('Bem-vinda ao Bloco de Notas.\r\n\r\nAqui você pode digitar o que quiser.\r\n')
  const [wrap, setWrap] = useState(true)

  return (
    <Root>
      <XpMenuBar>
        <XpMenuItem><u>A</u>rquivo</XpMenuItem>
        <XpMenuItem><u>E</u>ditar</XpMenuItem>
        <XpMenuItem>F<u>o</u>rmatar</XpMenuItem>
        <XpMenuItem onClick={() => setWrap((w) => !w)}>E<u>x</u>ibir</XpMenuItem>
        <XpMenuItem>Aj<u>u</u>da</XpMenuItem>
      </XpMenuBar>
      <Editor
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        $wrap={wrap}
      />
      <XpStatusBar>
        <XpStatusField>Ln {text.slice(0, text.length).split('\n').length}, Col {text.length}</XpStatusField>
        <XpStatusField>{wrap ? 'Quebra automática' : 'Sem quebra'}</XpStatusField>
      </XpStatusBar>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fff;
`

const Editor = styled.textarea<{ $wrap: boolean }>`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Lucida Console', 'Courier New', monospace;
  font-size: 12px;
  padding: 4px;
  white-space: ${(p) => (p.$wrap ? 'pre-wrap' : 'pre')};
  overflow: auto;
  color: #000;
`

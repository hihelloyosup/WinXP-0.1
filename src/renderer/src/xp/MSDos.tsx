import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

export const MSDos: React.FC = () => {
  const [lines, setLines] = useState<string[]>([
    'Microsoft(R) Windows DOS',
    '(C)Copyright Microsoft Corp 1990-2001.',
    ''
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentPath = 'C:\\WINDOWS\\system32>'

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    const args = trimmed.split(' ')
    const baseCmd = args[0].toLowerCase()

    setLines((prev) => [...prev, `${currentPath}${cmd}`])

    if (!trimmed) return

    switch (baseCmd) {
      case 'help':
        setLines((prev) => [
          ...prev,
          'Comandos disponíveis:',
          '  HELP     Fornece informações de ajuda para os comandos do Windows.',
          '  DIR      Exibe uma lista de arquivos e subpastas em uma pasta.',
          '  CLS      Limpa a tela.',
          '  ECHO     Exibe mensagens ou ativa/desativa o eco de comandos.',
          '  FDISK    Configura o disco rígido (simulado).',
          '  EDIT     Abre o editor de texto do MS-DOS (simulado).',
          '  BSOD     Ativa/desativa Blue Screen of Death (bsod on/off).',
          '  RESET    Reinicia o sistema imediatamente (comando exclusivo).',
          '  EXIT     Sai do MS-DOS e reinicia o computador.',
          ''
        ])
        break
      case 'dir':
        setLines((prev) => [
          ...prev,
          ' O volume na unidade C é Sistema',
          ' O Número de Série do Volume é 1234-5678',
          '',
          ' Pasta de C:\\WINDOWS\\system32',
          '',
          '02/05/2026  12:00    <DIR>          .',
          '02/05/2026  12:00    <DIR>          ..',
          '02/05/2026  12:00           12.345 cmd.exe',
          '02/05/2026  12:00           45.678 ntoskrnl.exe',
          '02/05/2026  12:00           89.012 hal.dll',
          '               3 arquivo(s)        147.035 bytes',
          '               2 pasta(s)   10.234.567.890 bytes livres',
          ''
        ])
        break
      case 'cls':
        setLines([])
        break
      case 'echo':
        setLines((prev) => [...prev, args.slice(1).join(' '), ''])
        break
      case 'fdisk':
        setLines((prev) => [
          ...prev,
          'FDISK - Utilitário de Partição de Disco Fixo',
          'Opções Atuais de Partição de Disco Fixo:',
          '',
          'Partição  Status   Tipo    Rótulo do Volume  Mbytes   Sistema   Uso',
          ' C: 1        A    PRI DOS   Sistema           40960   FAT32    100%',
          '',
          'Aviso: Este utilitário está rodando em modo simulado.',
          'Nenhuma alteração real será feita no seu disco rígido.',
          ''
        ])
        break
      case 'edit':
        if (args[1] && args[1].toLowerCase() === 'config.sys') {
          setLines((prev) => [
            ...prev,
            'Abrindo editor de texto...',
            '[Conteúdo de CONFIG.SYS simulado]',
            'FILES=40',
            'BUFFERS=40',
            'DEVICE=C:\\WINDOWS\\HIMEM.SYS',
            'DEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS',
            'DOS=HIGH,UMB',
            ''
          ])
        } else {
          setLines((prev) => [
            ...prev,
            'O comando EDIT precisa de um arquivo. Ex: edit config.sys',
            ''
          ])
        }
        break
      case 'bsod':
        if (args[1] === 'on') {
          localStorage.setItem('bsodEnabled', 'true')
          setLines((prev) => [...prev, 'Blue Screen of Death ATIVADO.', ''])
        } else if (args[1] === 'off') {
          localStorage.setItem('bsodEnabled', 'false')
          setLines((prev) => [...prev, 'Blue Screen of Death DESATIVADO.', 'Danos ao sistema serao ignorados.', ''])
        } else {
          const status = localStorage.getItem('bsodEnabled') !== 'false' ? 'ATIVADO' : 'DESATIVADO'
          setLines((prev) => [...prev, 'Uso: bsod on | bsod off', `Status atual: ${status}`, ''])
        }
        break
      case 'reset':
        setLines((prev) => [
          ...prev,
          'REINICIANDO SISTEMA...',
          'Limpando memória... OK',
          'Recarregando kernel... OK',
          'Inicializando...',
          ''
        ])
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        break
      case 'exit':
        window.location.hash = ''
        window.location.reload()
        break
      default:
        setLines((prev) => [
          ...prev,
          `'${baseCmd}' não é reconhecido como um comando interno`,
          'ou externo, um programa operável ou um arquivo em lotes.',
          ''
        ])
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    }
  }

  return (
    <Root onClick={() => inputRef.current?.focus()}>
      <Container ref={containerRef}>
        {lines.map((line, i) => (
          <Line key={i}>{line}</Line>
        ))}
        <InputRow>
          <span>{currentPath}</span>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </InputRow>
      </Container>
    </Root>
  )
}

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #c0c0c0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 16px;
  overflow: hidden;
  cursor: text;
`

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 12px;
    background: #000;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
  }
`

const Line = styled.div`
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 19px;
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
`

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #c0c0c0;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  margin-left: 0;
  padding: 0;
`

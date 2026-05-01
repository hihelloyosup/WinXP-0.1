import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { XpStatusBar, XpStatusField } from '../ui'
import { useOpenApp, useWindows } from '../WindowSystem'
import { useVirtualFS } from '../VirtualFileSystem'
import type { AppInstance } from '../types'

type Mode = 'shell' | 'matrix' | 'snake'
type Point = { x: number; y: number }
type PromptColor = 'white' | 'green' | 'yellow'

interface CommandDef {
  name: string
  description: string
  easterEgg?: boolean
}

const COMMAND_DEFS: CommandDef[] = [
  { name: 'help', description: 'Lista os comandos disponíveis' },
  { name: 'cls', description: 'Limpa a tela' },
  { name: 'clear', description: 'Alias para cls' },
  { name: 'ver', description: 'Exibe versão do sistema' },
  { name: 'date', description: 'Mostra a data atual' },
  { name: 'time', description: 'Mostra a hora atual' },
  { name: 'echo', description: 'Escreve texto no prompt' },
  { name: 'dir', description: 'Lista conteúdo do diretório atual' },
  { name: 'cd', description: 'Mostra ou altera diretório atual' },
  { name: 'pwd', description: 'Mostra caminho atual' },
  { name: 'whoami', description: 'Mostra usuário atual' },
  { name: 'hostname', description: 'Mostra nome da máquina' },
  { name: 'title', description: 'Altera título da janela' },
  { name: 'color', description: 'Altera cor do terminal (simulação)' },
  { name: 'prompt', description: 'Altera prompt (simulação)' },
  { name: 'systeminfo', description: 'Informações do sistema' },
  { name: 'ipconfig', description: 'Configuração de rede' },
  { name: 'ping', description: 'Testa conectividade (simulação)' },
  { name: 'tracert', description: 'Rota de rede (simulação)' },
  { name: 'netstat', description: 'Conexões de rede (simulação)' },
  { name: 'tasklist', description: 'Lista tarefas (simulação)' },
  { name: 'calc', description: 'Abre calculadora' },
  { name: 'notepad', description: 'Abre bloco de notas' },
  { name: 'paint', description: 'Abre Paint' },
  { name: 'explorer', description: 'Abre Meu Computador' },
  { name: 'iexplore', description: 'Abre Internet Explorer' },
  { name: 'control', description: 'Abre Painel de Controle' },
  { name: 'regedit', description: 'Abre Editor de Registro' },
  { name: 'search', description: 'Abre Pesquisa' },
  { name: 'run', description: 'Abre Executar' },
  { name: 'about', description: 'Abre Sobre o Windows' },
  { name: 'mem', description: 'Mostra uso de memória' },
  { name: 'cpu', description: 'Mostra uso de CPU' },
  { name: 'disk', description: 'Mostra uso de disco' },
  { name: 'tree', description: 'Mostra árvore de diretórios' },
  { name: 'find', description: 'Busca texto (simulação)' },
  { name: 'type', description: 'Mostra conteúdo de arquivo (simulação)' },
  { name: 'copy', description: 'Copia arquivo (simulação)' },
  { name: 'move', description: 'Move arquivo (simulação)' },
  { name: 'del', description: 'Deleta arquivo (simulação)' },
  { name: 'mkdir', description: 'Cria pasta (simulação)' },
  { name: 'rmdir', description: 'Remove pasta (simulação)' },
  { name: 'attrib', description: 'Atributos de arquivo (simulação)' },
  { name: 'shutdown', description: 'Desligamento (simulação)' },
  { name: 'restart', description: 'Reinício (simulação)' },
  { name: 'exit', description: 'Fecha o prompt' },
  { name: 'history', description: 'Mostra histórico de comandos' },
  { name: 'reset', description: 'Restaura sistema para estado inicial' },
  { name: 'matrix', description: 'Easter egg Matrix', easterEgg: true },
  { name: 'snake', description: 'Easter egg Snake ASCII', easterEgg: true },
  { name: 'gabriel', description: 'Mensagem para o criador', easterEgg: true }
]

const W = 26
const H = 14

export const CommandPrompt: React.FC<{ instance: AppInstance }> = ({ instance }) => {
  const openApp = useOpenApp()
  const { close } = useWindows()
  const { reset } = useVirtualFS()
  const [mode, setMode] = useState<Mode>('shell')
  const [prompt, setPrompt] = useState('C:\\>')
  const [title, setTitle] = useState('Prompt de comando')
  const [promptColor, setPromptColor] = useState<PromptColor>('white')
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>([
    'Microsoft Windows XP [versão 5.1.2600]',
    '(C) Copyright 1985-2003 Microsoft Corp.',
    `Comandos: ${COMMAND_DEFS.length} total (${COMMAND_DEFS.filter((c) => !c.easterEgg).length} reais + 3 easter eggs).`,
    ''
  ])
  const [history, setHistory] = useState<string[]>([])
  const [snake, setSnake] = useState<{ body: Point[]; dir: Point; food: Point; over: boolean }>({
    body: [{ x: 10, y: 7 }, { x: 9, y: 7 }],
    dir: { x: 1, y: 0 },
    food: { x: 17, y: 5 },
    over: false
  })
  const [matrixLines, setMatrixLines] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [mode])

  useEffect(() => {
    if (mode !== 'matrix') return
    const id = window.setInterval(() => {
      const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&'
      const row = Array.from({ length: 70 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      setMatrixLines((prev) => [...prev.slice(-22), row])
    }, 80)
    return () => window.clearInterval(id)
  }, [mode])

  useEffect(() => {
    if (mode !== 'snake') return
    const id = window.setInterval(() => {
      setSnake((prev) => {
        if (prev.over) return prev
        const head = prev.body[0]
        const next = { x: head.x + prev.dir.x, y: head.y + prev.dir.y }
        if (next.x < 0 || next.y < 0 || next.x >= W || next.y >= H || prev.body.some((p) => p.x === next.x && p.y === next.y)) {
          return { ...prev, over: true }
        }
        const ate = next.x === prev.food.x && next.y === prev.food.y
        const nextBody = [next, ...prev.body]
        if (!ate) nextBody.pop()
        const nextFood = ate
          ? { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) }
          : prev.food
        return { ...prev, body: nextBody, food: nextFood }
      })
    }, 130)
    return () => window.clearInterval(id)
  }, [mode])

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (mode === 'matrix' && e.key === 'Escape') {
        setMode('shell')
        setLines((prev) => [...prev, 'Matrix encerrado.', ''])
      }
      if (mode !== 'snake') return
      if (e.key === 'Escape') {
        setMode('shell')
        setLines((prev) => [...prev, 'Snake encerrado.', ''])
        return
      }
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') setSnake((s) => ({ ...s, dir: { x: 0, y: -1 } }))
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') setSnake((s) => ({ ...s, dir: { x: 0, y: 1 } }))
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') setSnake((s) => ({ ...s, dir: { x: -1, y: 0 } }))
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') setSnake((s) => ({ ...s, dir: { x: 1, y: 0 } }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode])

  const snakeView = useMemo(() => {
    const grid = Array.from({ length: H }, () => Array.from({ length: W }, () => ' '))
    snake.body.forEach((p, i) => {
      if (p.y >= 0 && p.y < H && p.x >= 0 && p.x < W) grid[p.y][p.x] = i === 0 ? '@' : 'o'
    })
    grid[snake.food.y][snake.food.x] = '*'
    const border = `+${'-'.repeat(W)}+`
    const rows = grid.map((r) => `|${r.join('')}|`)
    const footer = snake.over ? 'GAME OVER - ESC para sair' : 'Use WASD/Setas - ESC para sair'
    return [border, ...rows, border, footer]
  }, [snake])

  const append = (...out: string[]): void => setLines((prev) => [...prev, ...out])

  const runCommand = (): void => {
    const raw = input.trim()
    if (!raw) return
    const [cmd, ...args] = raw.split(/\s+/)
    const lower = cmd.toLowerCase()
    setHistory((prev) => [...prev, raw])
    append(`${prompt} ${raw}`)
    setInput('')

    switch (lower) {
      case 'help':
        append(...COMMAND_DEFS.map((c) => `${c.name.padEnd(10)} - ${c.description}`), '')
        return
      case 'cls':
      case 'clear':
        setLines([])
        return
      case 'ver':
        append('Windows XP [versão 5.1.2600]', '')
        return
      case 'date':
        append(`Data atual: ${new Date().toLocaleDateString('pt-BR')}`, '')
        return
      case 'time':
        append(`Hora atual: ${new Date().toLocaleTimeString('pt-BR')}`, '')
        return
      case 'echo':
        append(args.join(' '), '')
        return
      case 'dir':
        append(' Volume na unidade C nao possui rotulo.', ' Diretorio de C:\\', ' cmd.exe', ' notepad.exe', ' paint.exe', '')
        return
      case 'cd':
      case 'pwd':
        append(prompt.replace('>', ''), '')
        return
      case 'whoami':
        append('camilla', '')
        return
      case 'hostname':
        append('DESKTOP-XP01', '')
        return
      case 'title':
        setTitle(args.join(' ') || 'Prompt de comando')
        append(`Titulo definido: ${args.join(' ') || 'Prompt de comando'}`, '')
        return
      case 'color':
        if (!args[0]) {
          append('Uso: color branco|verde|amarelo', '')
          return
        }
        if (args[0].toLowerCase() === 'branco' || args[0].toLowerCase() === 'white') {
          setPromptColor('white')
          append('Cor alterada para branco.', '')
          return
        }
        if (args[0].toLowerCase() === 'verde' || args[0].toLowerCase() === 'green') {
          setPromptColor('green')
          append('Cor alterada para verde.', '')
          return
        }
        if (args[0].toLowerCase() === 'amarelo' || args[0].toLowerCase() === 'yellow') {
          setPromptColor('yellow')
          append('Cor alterada para amarelo.', '')
          return
        }
        append('Cor invalida. Use: branco, verde ou amarelo.', '')
        return
      case 'prompt':
        setPrompt(args.join(' ') || 'C:\\>')
        append('Prompt atualizado.', '')
        return
      case 'systeminfo':
        append('OS: Windows XP Home Edition', 'CPU: Pentium 4', 'RAM: 384 MB', '')
        return
      case 'ipconfig':
        append('IP: 192.168.1.42', 'Mascara: 255.255.255.0', 'Gateway: 192.168.1.1', '')
        return
      case 'ping':
        append(`Resposta de ${args[0] || 'localhost'}: bytes=32 tempo<1ms TTL=128`, '')
        return
      case 'tracert':
        append(`Rastreando rota para ${args[0] || 'localhost'}... concluido.`, '')
        return
      case 'netstat':
        append('TCP 127.0.0.1:80 ESTABLISHED', 'TCP 127.0.0.1:443 ESTABLISHED', '')
        return
      case 'tasklist':
        append('explorer.exe', 'winlogon.exe', 'cmd.exe', '')
        return
      case 'calc':
        openApp('calculator'); append('Abrindo Calculadora...', ''); return
      case 'notepad':
        openApp('notepad'); append('Abrindo Bloco de Notas...', ''); return
      case 'paint':
        openApp('paint'); append('Abrindo Paint...', ''); return
      case 'explorer':
        openApp('myComputer'); append('Abrindo Meu Computador...', ''); return
      case 'iexplore':
        openApp('ie'); append('Abrindo Internet Explorer...', ''); return
      case 'control':
        openApp('controlPanel'); append('Abrindo Painel de Controle...', ''); return
      case 'regedit':
        openApp('regedit'); append('Abrindo Regedit...', ''); return
      case 'search':
        openApp('search'); append('Abrindo Pesquisa...', ''); return
      case 'run':
        openApp('run'); append('Abrindo Executar...', ''); return
      case 'about':
        openApp('about'); append('Abrindo Sobre o Windows...', ''); return
      case 'mem':
        append('Memoria em uso: 251 MB / 384 MB', '')
        return
      case 'cpu':
        append('CPU: 12% em uso', '')
        return
      case 'disk':
        append('Disco C: 37.2 GB livres de 80 GB', '')
        return
      case 'tree':
        append('C:\\', '├── system32', '├── Documents and Settings', '└── Program Files', '')
        return
      case 'find':
        append(`Busca por "${args.join(' ')}" concluida (simulacao).`, '')
        return
      case 'type':
        append(`Conteudo de ${args[0] || 'arquivo.txt'}:`, '[simulacao de conteudo]', '')
        return
      case 'copy':
      case 'move':
      case 'del':
      case 'mkdir':
      case 'rmdir':
      case 'attrib':
        append(`Comando ${lower} executado em modo simulacao.`, '')
        return
      case 'shutdown':
        append('Comando de desligamento bloqueado nesta demo.', '')
        return
      case 'restart':
        append('Comando de reinicio bloqueado nesta demo.', '')
        return
      case 'reset':
        reset()
        append('Sistema restaurado para o estado inicial.', '')
        return
      case 'exit':
        close(instance.id)
        return
      case 'history':
        append(...history.map((h, i) => `${i + 1}. ${h}`), '')
        return
      case 'matrix':
        setMode('matrix')
        setMatrixLines([])
        return
      case 'snake':
        setMode('snake')
        setSnake({ body: [{ x: 10, y: 7 }, { x: 9, y: 7 }], dir: { x: 1, y: 0 }, food: { x: 17, y: 5 }, over: false })
        return
      case 'gabriel':
        append(
          'Obrigado, Gabriel, por criar este projeto!',
          'Estamos adorando construir essa experiência e esperamos por mods da comunidade.',
          'Como o projeto é open source, vai ficar ainda mais forte com suas ideias.',
          ''
        )
        return
      default:
        append(`'${cmd}' nao e reconhecido como comando interno.`, '')
    }
  }

  return (
    <Root>
      <TopBar>{title}</TopBar>
      <TerminalArea $tone={promptColor}>
        {mode === 'shell' && (
          <>
            {lines.map((line, i) => <div key={i}>{line}</div>)}
            <InputRow>
              <span>{prompt}</span>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runCommand()}
              />
            </InputRow>
          </>
        )}
        {mode === 'matrix' && (
          <Matrix>
            {matrixLines.map((line, i) => <div key={i}>{line}</div>)}
            <Hint>ESC para voltar</Hint>
          </Matrix>
        )}
        {mode === 'snake' && (
          <Snake>
            {snakeView.map((line, i) => <div key={i}>{line}</div>)}
          </Snake>
        )}
      </TerminalArea>
      <XpStatusBar>
        <XpStatusField>{mode === 'shell' ? 'Pronto' : mode === 'matrix' ? 'Modo Matrix' : 'Snake ASCII'}</XpStatusField>
        <XpStatusField>{COMMAND_DEFS.length} comandos</XpStatusField>
      </XpStatusBar>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
`

const TopBar = styled.div`
  padding: 4px 8px;
  font-size: 11px;
  color: #d8f8d8;
  background: #0b210b;
  border-bottom: 1px solid #2a5a2a;
`

const TerminalArea = styled.div<{ $tone: PromptColor }>`
  flex: 1;
  overflow: auto;
  padding: 8px;
  font-family: 'Lucida Console', 'Courier New', monospace;
  font-size: 12px;
  color: ${(p) => (p.$tone === 'white' ? '#f4f4f4' : p.$tone === 'yellow' ? '#ffe37a' : '#8cff8c')};
  background: #000;
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: transparent;
`

const Matrix = styled.div`
  color: #1cff1c;
`

const Snake = styled.div`
  color: #8cff8c;
  white-space: pre;
`

const Hint = styled.div`
  margin-top: 8px;
  color: #6cbf6c;
`

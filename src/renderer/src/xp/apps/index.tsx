import type { AppDefinition } from '../types'
import { Icon } from '../icons'
import { MyComputer, MyDocuments, MyPictures, RecycleBin } from './Explorer'
import { Notepad } from './Notepad'
import { Calculator } from './Calculator'
import { Paint } from './Paint'
import { Minesweeper } from './Minesweeper'
import { Solitaire } from './Solitaire'
import { InternetExplorer } from './InternetExplorer'
import { Outlook } from './Outlook'
import { MediaPlayer } from './MediaPlayer'
import { ControlPanel } from './ControlPanel'
import { RunDialog } from './RunDialog'
import { About } from './About'
import { MsnExplorer } from './MsnExplorer'
import { HelpCenter } from './Help'
import { SearchApp } from './SearchApp'
import { Regedit } from './Regedit'
import { SecurityCenter } from './SecurityCenter'
import { CommandPrompt } from './CommandPrompt'
import { TaskManager } from './TaskManager'
import { Pong } from './Pong'

export const APPS: AppDefinition[] = [
  {
    id: 'myComputer',
    title: 'Meu Computador',
    icon: Icon.myComputer32,
    defaultSize: { width: 780, height: 520 },
    render: () => <MyComputer />
  },
  {
    id: 'myDocuments',
    title: 'Meus Documentos',
    icon: Icon.myDocs32,
    defaultSize: { width: 780, height: 520 },
    render: () => <MyDocuments />
  },
  {
    id: 'myPictures',
    title: 'Minhas Imagens',
    icon: Icon.myPictures32,
    defaultSize: { width: 780, height: 520 },
    render: () => <MyPictures />
  },
  {
    id: 'recycleBin',
    title: 'Lixeira',
    icon: Icon.recycleFull32,
    defaultSize: { width: 780, height: 480 },
    render: () => <RecycleBin />
  },
  {
    id: 'recentDocs',
    title: 'Documentos recentes',
    icon: Icon.folder32,
    defaultSize: { width: 700, height: 460 },
    render: () => <MyDocuments />
  },
  {
    id: 'notepad',
    title: 'Sem título - Bloco de Notas',
    icon: Icon.notepad32,
    defaultSize: { width: 560, height: 420 },
    multiInstance: true,
    render: () => <Notepad />
  },
  {
    id: 'calculator',
    title: 'Calculadora',
    icon: Icon.calculator32,
    defaultSize: { width: 260, height: 300 },
    resizable: false,
    render: () => <Calculator />
  },
  {
    id: 'paint',
    title: 'Sem título - Paint',
    icon: Icon.paint32,
    defaultSize: { width: 760, height: 560 },
    render: () => <Paint />
  },
  {
    id: 'minesweeper',
    title: 'Campo Minado',
    icon: Icon.mine,
    defaultSize: { width: 320, height: 300 },
    resizable: false,
    render: () => <Minesweeper />
  },
  {
    id: 'solitaire',
    title: 'Paciência',
    icon: Icon.solitaire,
    defaultSize: { width: 620, height: 500 },
    render: () => <Solitaire />
  },
  {
    id: 'ie',
    title: 'MSN.com - Microsoft Internet Explorer',
    icon: Icon.ieBig,
    defaultSize: { width: 880, height: 620 },
    render: () => <InternetExplorer />
  },
  {
    id: 'outlook',
    title: 'Caixa de entrada - Outlook Express',
    icon: Icon.outlookExpr32,
    defaultSize: { width: 820, height: 560 },
    render: () => <Outlook />
  },
  {
    id: 'mediaPlayer',
    title: 'Windows Media Player',
    icon: Icon.mediaPlayer32,
    defaultSize: { width: 760, height: 520 },
    render: () => <MediaPlayer />
  },
  {
    id: 'controlPanel',
    title: 'Painel de Controle',
    icon: Icon.controlPanel32,
    defaultSize: { width: 780, height: 540 },
    render: () => <ControlPanel />
  },
  {
    id: 'run',
    title: 'Executar',
    icon: Icon.run32,
    defaultSize: { width: 380, height: 190 },
    resizable: false,
    render: (i) => <RunDialog instance={i} />
  },
  {
    id: 'about',
    title: 'Sobre o Windows',
    icon: Icon.help32,
    defaultSize: { width: 440, height: 340 },
    resizable: false,
    render: (i) => <About instance={i} />
  },
  {
    id: 'msn',
    title: 'MSN Explorer',
    icon: Icon.msn,
    defaultSize: { width: 720, height: 520 },
    render: () => <MsnExplorer />
  },
  {
    id: 'help',
    title: 'Ajuda e Suporte',
    icon: Icon.help32,
    defaultSize: { width: 780, height: 540 },
    render: () => <HelpCenter />
  },
  {
    id: 'search',
    title: 'Resultados da pesquisa',
    icon: Icon.search32,
    defaultSize: { width: 720, height: 500 },
    render: () => <SearchApp />
  },
  {
    id: 'printers',
    title: 'Impressoras e Faxes',
    icon: Icon.printer32,
    defaultSize: { width: 640, height: 420 },
    render: () => <ControlPanel />
  },
  {
    id: 'regedit',
    title: 'Editor do Registro',
    icon: Icon.notepad32,
    defaultSize: { width: 780, height: 500 },
    render: () => <Regedit />
  },
  {
    id: 'securityCenter',
    title: 'Central de Segurança do Windows',
    icon: Icon.security32,
    defaultSize: { width: 720, height: 520 },
    render: () => <SecurityCenter />
  },
  {
    id: 'cmd',
    title: 'Prompt de comando',
    icon: Icon.cmd16,
    defaultSize: { width: 760, height: 480 },
    render: (i) => <CommandPrompt instance={i} />
  },
  {
    id: 'taskMgr',
    title: 'Gerenciador de Tarefas do Windows',
    icon: Icon.myComputer32,
    defaultSize: { width: 640, height: 480 },
    render: () => <TaskManager />
  },
  {
    id: 'pong',
    title: 'Pong XP',
    icon: Icon.pinball,
    defaultSize: { width: 680, height: 480 },
    render: () => <Pong />
  }
]

import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { XpToolbar, XpToolbarBtn } from '../ui'
import { Tutorial } from './Tutorial'

const TOPICS: Record<string, { title: string; body: React.ReactNode }> = {
  welcome: {
    title: 'O que há de novo no Windows XP',
    body: (
      <>
        <h2>Bem-vinda ao Windows XP</h2>
        <p>
          O Windows XP traz uma interface totalmente redesenhada chamada Luna, um novo menu Iniciar
          em duas colunas, melhor suporte a redes sem fio, compartilhamento de arquivos mais intuitivo
          e uma central de ajuda integrada (esta mesma que você está lendo agora).
        </p>
        <ul>
          <li>Menu Iniciar reformulado em duas colunas</li>
          <li>Gravação de CDs direto pelo Windows Explorer</li>
          <li>Proteção automática contra falhas de sistema</li>
          <li>Firewall integrado (Central de Segurança no SP2)</li>
        </ul>
      </>
    )
  },
  shortcuts: {
    title: 'Atalhos de teclado',
    body: (
      <>
        <h2>Atalhos úteis do Windows</h2>
        <table>
          <tbody>
            <tr><td><kbd>Ctrl+C</kbd></td><td>Copiar</td></tr>
            <tr><td><kbd>Ctrl+V</kbd></td><td>Colar</td></tr>
            <tr><td><kbd>Alt+Tab</kbd></td><td>Alternar janelas</td></tr>
            <tr><td><kbd>Win+D</kbd></td><td>Mostrar área de trabalho</td></tr>
            <tr><td><kbd>Win+E</kbd></td><td>Abrir Meu computador</td></tr>
            <tr><td><kbd>Win+R</kbd></td><td>Executar</td></tr>
            <tr><td><kbd>F1</kbd></td><td>Ajuda</td></tr>
          </tbody>
        </table>
      </>
    )
  },
  security: {
    title: 'Manter o computador seguro',
    body: (
      <>
        <h2>Proteja seu computador</h2>
        <p>
          Para manter o Windows XP seguro, siga estas três etapas: ative o firewall do Windows,
          mantenha as atualizações automáticas em dia e instale um antivírus.
        </p>
        <ol>
          <li>Abra o Painel de Controle → Central de Segurança.</li>
          <li>Verifique o status do Firewall e das Atualizações Automáticas.</li>
          <li>Baixe atualizações através de http://windowsupdate.microsoft.com.</li>
        </ol>
      </>
    )
  },
  tutorial: {
    title: 'Tutorial - Windows XP Emulado',
    body: <Tutorial />
  }
}

export const HelpCenter: React.FC = () => {
  const [topic, setTopic] = useState('welcome')
  return (
    <Root>
      <HeaderBar>
        <img src={Icon.help32} alt="" />
        <div>
          <strong>Ajuda e Suporte</strong>
          <br />
          <small>Windows XP Home Edition</small>
        </div>
        <Search>
          <input placeholder="Pesquisar" />
          <button>Ir</button>
        </Search>
      </HeaderBar>
      <XpToolbar>
        <XpToolbarBtn><img src={Icon.home} alt="" /> Início</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.history} alt="" /> Histórico</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.back} alt="" /> Voltar</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.forward} alt="" /> Avançar</XpToolbarBtn>
      </XpToolbar>
      <Body>
        <Aside>
          <h4>Escolha um tópico de ajuda</h4>
          <TopicBtn $active={topic === 'welcome'} onClick={() => setTopic('welcome')}>
            Novidades do Windows XP
          </TopicBtn>
          <TopicBtn $active={topic === 'shortcuts'} onClick={() => setTopic('shortcuts')}>
            Atalhos de teclado
          </TopicBtn>
          <TopicBtn $active={topic === 'security'} onClick={() => setTopic('security')}>
            Manter o computador seguro
          </TopicBtn>
          <TopicBtn $active={topic === 'tutorial'} onClick={() => setTopic('tutorial')}>
            Tutorial do Sistema
          </TopicBtn>
          <h4>Solicitar assistência</h4>
          <Link>Convidar um amigo com a Assistência Remota</Link>
          <Link>Conectar-se ao suporte da Microsoft</Link>
        </Aside>
        <Content $isTutorial={topic === 'tutorial'}>{TOPICS[topic].body}</Content>
      </Body>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ece9d8;
`

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: linear-gradient(180deg, #2a66c8 0%, #0e3ea3 100%);
  color: #fff;
  img { width: 36px; height: 36px; }
  strong { font-size: 14px; }
  small { font-size: 11px; color: #bcd0ff; }
`

const Search = styled.div`
  margin-left: auto;
  display: flex;
  gap: 4px;
  input {
    padding: 3px 6px;
    border: 1px solid #0e3ea3;
    font-size: 11px;
  }
  button {
    background: #f60;
    color: #fff;
    border: 1px solid #fff;
    padding: 3px 10px;
    cursor: pointer;
    font-weight: bold;
  }
`

const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`

const Aside = styled.aside`
  width: 220px;
  background: linear-gradient(180deg, #bbd2f3 0%, #7ba0ea 100%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  h4 { margin: 10px 0 2px; color: #0a246a; font-size: 11px; }
`

const TopicBtn = styled.button<{ $active: boolean }>`
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.7)' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? '#0a246a' : 'transparent')};
  padding: 4px 6px;
  color: #0a246a;
  text-align: left;
  font-size: 11px;
  cursor: pointer;
  border-radius: 2px;
  &:hover { background: rgba(255,255,255,0.5); }
`

const Link = styled.a`
  color: #0a246a;
  text-decoration: underline;
  font-size: 11px;
  cursor: pointer;
`

const Content = styled.div<{ $isTutorial?: boolean }>`
  flex: 1;
  padding: ${(p) => (p.$isTutorial ? '0' : '16px 22px')};
  background: #fff;
  overflow: auto;
  font-size: 12px;
  line-height: 1.5;
  h2 { color: #003fa0; margin-top: 0; }
  kbd {
    background: #f3f3f3;
    border: 1px solid #999;
    border-radius: 3px;
    padding: 1px 4px;
    font-family: 'Lucida Console', monospace;
    font-size: 11px;
  }
  table { border-collapse: collapse; }
  table td { padding: 3px 10px 3px 0; }
`

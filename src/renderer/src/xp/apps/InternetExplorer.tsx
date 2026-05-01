import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { useSystemSettings } from '../SystemSettings'
import { XpAddressBar, XpMenuBar, XpMenuItem, XpStatusBar, XpStatusField, XpToolbar, XpToolbarBtn } from '../ui'

interface Page {
  title: string
  body: React.ReactNode
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ece9d8;
`

const Sep = styled.div`
  width: 1px;
  height: 60%;
  background: #b3b3b3;
  margin: 0 4px;
`

const LinksBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px;
  background: #ece9d8;
  border-bottom: 1px solid #b3b3b3;
  font-size: 11px;
`

const Icon16 = styled.img`
  width: 16px;
  height: 16px;
`

const LinkA = styled.a`
  color: #00c;
  text-decoration: underline;
  cursor: pointer;
`

const PageArea = styled.div`
  flex: 1;
  overflow: auto;
  background: #fff;
  color: #000;
  font-family: 'Times New Roman', serif;
`

const HomeBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

const HomeHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background: linear-gradient(180deg, #d8e7ff 0%, #fff 100%);
  border-bottom: 3px solid #003fa0;
  nav { display: flex; gap: 14px; }
  nav a { color: #003fa0; font-size: 12px; }
`

const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 14px 18px;
`

const HomeBox = styled.section`
  background: #fff;
  border: 1px solid #ccd;
  border-radius: 4px;
  padding: 10px 14px;
  h3 { margin: 0 0 6px 0; font-size: 14px; color: #003fa0; border-bottom: 1px dashed #ccd; padding-bottom: 3px; }
  ul { margin: 0; padding-left: 18px; font-size: 12px; color: #222; }
  li { margin-bottom: 4px; cursor: pointer; }
  li:hover { text-decoration: underline; color: #00c; }
`

const Footer = styled.div`
  margin-top: auto;
  padding: 10px;
  text-align: center;
  font-size: 10px;
  color: #666;
  border-top: 1px solid #ccd;
`

const Article = styled.article`
  padding: 20px 28px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 720px;
  h2 { color: #003fa0; }
`

const HOME: Page = {
  title: 'MSN.com - Seu portal de notícias',
  body: (
    <HomeBody>
      <HomeHeader>
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#003fa0' }}>
          msn<sup style={{ color: '#f60', fontSize: 16 }}>®</sup>
        </div>
        <nav>
          <a href="#">Hotmail</a>
          <a href="#">MSN Messenger</a>
          <a href="#">Horóscopo</a>
          <a href="#">Encarta</a>
        </nav>
      </HomeHeader>
      <HomeGrid>
        <HomeBox>
          <h3>Notícias</h3>
          <ul>
            <li>Nova versão do Windows XP Service Pack 2 é lançada</li>
            <li>Microsoft anuncia parceria com fabricantes de PC</li>
            <li>Internet Explorer 6 ganha atualização de segurança</li>
            <li>Dicas para manter seu computador protegido</li>
          </ul>
        </HomeBox>
        <HomeBox>
          <h3>Esportes</h3>
          <ul>
            <li>Finais do campeonato brasileiro começam hoje</li>
            <li>Seleção vence amistoso por 3 a 1</li>
            <li>Tênis: brasileiros avançam em Roland Garros</li>
          </ul>
        </HomeBox>
        <HomeBox>
          <h3>Tecnologia</h3>
          <ul>
            <li>Como gravar CDs com o Windows XP</li>
            <li>Placa de vídeo 64MB já é suficiente?</li>
            <li>Guia do iniciante em redes domésticas</li>
          </ul>
        </HomeBox>
        <HomeBox>
          <h3>Entretenimento</h3>
          <ul>
            <li>Cinemas lançam novas estreias para o fim de semana</li>
            <li>Paciência e Campo Minado continuam líderes de jogabilidade</li>
          </ul>
        </HomeBox>
      </HomeGrid>
      <Footer>© 2003 Microsoft Corporation. Todos os direitos reservados.</Footer>
    </HomeBody>
  )
}

const ABOUT: Page = {
  title: 'Sobre o Internet Explorer',
  body: (
    <Article>
      <h2>Microsoft® Internet Explorer</h2>
      <p>Versão: 6.0.2900.5512</p>
      <p>Idiomas: Português (Brasil)</p>
      <p>© 1995-2004 Microsoft Corporation. Todos os direitos reservados.</p>
      <p>
        Este navegador foi projetado para oferecer uma maneira mais segura e simples de navegar na Internet,
        com suporte a páginas HTML 4.01, Scripts Ativos, CSS e integração com o Windows XP.
      </p>
    </Article>
  )
}

const WELCOME: Page = {
  title: 'Bem-vindo ao Windows XP',
  body: (
    <Article>
      <h2>Bem-vindo ao Windows XP!</h2>
      <p>
        Este é um passeio guiado pelas novidades do Windows XP: a nova interface Luna, o menu Iniciar
        reformulado, o sistema de pastas renovado e muitos programas acessíveis a partir da barra de tarefas.
      </p>
      <p>Escolha um link na página inicial para continuar explorando.</p>
    </Article>
  )
}

const PAGES: Record<string, Page> = {
  'http://www.msn.com': HOME,
  'about:ie': ABOUT,
  'about:welcome': WELCOME
}

export const InternetExplorer: React.FC = () => {
  const { settings } = useSystemSettings()
  const [url, setUrl] = useState('http://www.msn.com')
  const [history, setHistory] = useState<string[]>(['http://www.msn.com'])
  const [pos, setPos] = useState(0)
  const offlinePage: Page = {
    title: 'Trabalhar offline',
    body: (
      <Article>
        <h2>Sem conexão de rede</h2>
        <p>A conexão de rede está desativada no Painel de Controle.</p>
        <p>Ative novamente em <b>Rede e Internet</b> para navegar.</p>
      </Article>
    )
  }
  const page = settings.networkConnected ? (PAGES[url] ?? HOME) : offlinePage

  const navigate = (to: string): void => {
    const next = history.slice(0, pos + 1).concat([to])
    setHistory(next)
    setPos(next.length - 1)
    setUrl(to)
  }

  const back = (): void => {
    if (pos > 0) {
      setPos(pos - 1)
      setUrl(history[pos - 1])
    }
  }

  const fwd = (): void => {
    if (pos < history.length - 1) {
      setPos(pos + 1)
      setUrl(history[pos + 1])
    }
  }

  return (
    <Root>
      <XpMenuBar>
        {['Arquivo', 'Editar', 'Exibir', 'Favoritos', 'Ferramentas', 'Ajuda'].map((m) => (
          <XpMenuItem key={m}><u>{m[0]}</u>{m.slice(1)}</XpMenuItem>
        ))}
      </XpMenuBar>
      <XpToolbar>
        <XpToolbarBtn onClick={back} $disabled={pos === 0}>
          <img src={Icon.back} alt="" /> Voltar
        </XpToolbarBtn>
        <XpToolbarBtn onClick={fwd} $disabled={pos === history.length - 1}>
          <img src={Icon.forward} alt="" /> Avançar
        </XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.stop} alt="" /> Parar</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.refresh} alt="" /> Atualizar</XpToolbarBtn>
        <XpToolbarBtn onClick={() => navigate('http://www.msn.com')} $disabled={!settings.networkConnected}><img src={Icon.home} alt="" /> Página inicial</XpToolbarBtn>
        <Sep />
        <XpToolbarBtn><img src={Icon.history} alt="" /> Histórico</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.mail} alt="" /> E-mail</XpToolbarBtn>
      </XpToolbar>
      <XpAddressBar>
        <span className="label">Endereço:</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(url)
          }}
        />
      </XpAddressBar>
      <LinksBar>
        <Icon16 src={Icon.links} /> Links
        <LinkA onClick={() => navigate('http://www.msn.com')}>MSN</LinkA>
        <LinkA onClick={() => navigate('about:welcome')}>Windows</LinkA>
        <LinkA onClick={() => navigate('about:ie')}>Sobre o IE</LinkA>
      </LinksBar>
      <PageArea>{page.body}</PageArea>
      <XpStatusBar>
        <XpStatusField>Concluído — {page.title}</XpStatusField>
        <XpStatusField>{settings.networkConnected ? 'Internet' : 'Offline'}</XpStatusField>
      </XpStatusBar>
    </Root>
  )
}

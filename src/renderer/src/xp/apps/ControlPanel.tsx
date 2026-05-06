import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { setAudioPreferences, Sounds, playSound } from '../sounds'
import { useSystemSettings } from '../SystemSettings'
import { useOpenApp } from '../WindowSystem'
import { XpButton, XpMenuBar, XpMenuItem, XpStatusBar, XpStatusField, XpToolbar, XpToolbarBtn } from '../ui'

type PanelView = 'home' | 'desktop' | 'network' | 'sound' | 'users' | 'accessibility' | 'tools'

interface PanelCategory {
  id: Exclude<PanelView, 'home'>
  title: string
  desc: string
  icon: string
}

const CATEGORIES: PanelCategory[] = [
  { id: 'desktop', title: 'Desktop e Tema', desc: 'Papel de parede e proteção de tela.', icon: Icon.myPictures32 },
  { id: 'network', title: 'Rede e Internet', desc: 'Conexão da máquina e Internet Explorer.', icon: Icon.network32 },
  { id: 'sound', title: 'Sons e Áudio', desc: 'Volume global e modo mudo.', icon: Icon.mediaPlayer32 },
  { id: 'users', title: 'Contas de Usuário', desc: 'Nome do usuário da sessão e permissões.', icon: Icon.user },
  { id: 'accessibility', title: 'Acessibilidade', desc: 'Alto contraste, Letras em Negrito, Narrador e Tradutor.', icon: Icon.security32 },
  { id: 'tools', title: 'Ferramentas do Sistema', desc: 'Atalhos para utilitários reais do sistema.', icon: Icon.controlPanel32 }
]

function generateSidePanelGradient(baseColor: string): string {
  const lighten = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = ((num >> 8) & 0x00ff) + amt
    const B = (num & 0x0000ff) + amt
    return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)
  }
  const darken = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = ((num >> 8) & 0x00ff) - amt
    const B = (num & 0x0000ff) - amt
    return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 + (G > 0 ? G : 0) * 0x100 + (B > 0 ? B : 0)).toString(16).slice(1)
  }
  return `linear-gradient(180deg, ${lighten(baseColor, 40)} 0%, ${lighten(baseColor, 20)} 100%)`
}

export const ControlPanel: React.FC = () => {
  const [view, setView] = useState<PanelView>('home')
  const openApp = useOpenApp()
  const { settings } = useSystemSettings()
  const sidePanelGradient = generateSidePanelGradient(settings.windowColor)

  return (
    <Root>
      <XpMenuBar>
        {['Arquivo', 'Editar', 'Exibir', 'Ferramentas', 'Ajuda'].map((m) => (
          <XpMenuItem key={m}><u>{m[0]}</u>{m.slice(1)}</XpMenuItem>
        ))}
      </XpMenuBar>
      <XpToolbar>
        <XpToolbarBtn $disabled={view === 'home'} onClick={() => setView('home')}>
          <img src={Icon.back} alt="" /> Voltar
        </XpToolbarBtn>
        <XpToolbarBtn onClick={() => setView('home')}>
          <img src={Icon.home} alt="" /> Início
        </XpToolbarBtn>
      </XpToolbar>

      <Body>
        <LeftPanel $gradient={sidePanelGradient}>
          <PanelTitle $color={settings.windowColor}>Painel de Controle</PanelTitle>
          <NavBtn onClick={() => setView('home')}>Página inicial</NavBtn>
          {CATEGORIES.map((cat) => (
            <NavBtn key={cat.id} onClick={() => setView(cat.id)}>
              {cat.title}
            </NavBtn>
          ))}
          <Separator />
          <NavBtn onClick={() => openApp('myComputer')}>Abrir Meu Computador</NavBtn>
          <NavBtn onClick={() => openApp('ie')}>Abrir Internet Explorer</NavBtn>
        </LeftPanel>

        <ContentArea>
          {view === 'home' && <HomeView onSelect={setView} />}
          {view === 'desktop' && <DesktopView />}
          {view === 'network' && <NetworkView />}
          {view === 'sound' && <SoundView />}
          {view === 'users' && <UsersView />}
          {view === 'accessibility' && <AccessibilityView />}
          {view === 'tools' && <ToolsView />}
        </ContentArea>
      </Body>

      <XpStatusBar>
        <XpStatusField>{view === 'home' ? 'Selecione uma categoria' : `Categoria: ${view}`}</XpStatusField>
        <XpStatusField>Usuário: {settings.username}</XpStatusField>
      </XpStatusBar>
    </Root>
  )
}

const HomeView: React.FC<{ onSelect: (next: PanelView) => void }> = ({ onSelect }) => (
  <Grid>
    <Banner>
      <h2>Painel de Controle</h2>
      <p>Opções reais aplicadas ao sistema</p>
    </Banner>
    {CATEGORIES.map((cat) => (
      <Card key={cat.id} onClick={() => onSelect(cat.id)}>
        <img src={cat.icon} alt="" />
        <div>
          <strong>{cat.title}</strong>
          <p>{cat.desc}</p>
        </div>
      </Card>
    ))}
  </Grid>
)

const visualStyles = [
  { name: 'Windows XP', value: 'xp' },
  { name: 'Windows Classic', value: 'classic' },
  { name: 'Alto Contraste Branco', value: 'high-contrast-white' },
  { name: 'Alto Contraste Preto', value: 'high-contrast-black' },
  { name: 'Alto Contraste #1', value: 'high-contrast-1' },
  { name: 'Alto Contraste #2', value: 'high-contrast-2' }
]

const DesktopView: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings()
  const [wallpaper, setWallpaper] = useState(settings.wallpaper)
  const [visualStyle, setVisualStyle] = useState(settings.visualStyle || 'xp')
  const [screensaver, setScreensaver] = useState(settings.screensaver || 'Nenhum')
  const [screensaverTimeout, setScreensaverTimeout] = useState(settings.screensaverTimeout || 60)

  const screensaverOptions = [
    { value: 'Nenhum', label: '(Nenhum)' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'stars', label: 'Túnel de Estrelas' },
    { value: 'bubbles', label: 'Bolhas' },
    { value: 'logo', label: 'Janelas Flutuantes' },
    { value: 'black', label: 'Tela Preta' }
  ]

  return (
    <Section>
      <h3>Desktop e Tema</h3>
      <fieldset>
        <legend>Área de Trabalho</legend>
        <Row>
          <label>Papel de parede:</label>
          <select value={wallpaper} onChange={(e) => setWallpaper(e.target.value)}>
            {['Bliss', 'Azul'].map((it) => <option key={it}>{it}</option>)}
          </select>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <label>Protetor de tela:</label>
          <select value={screensaver} onChange={(e) => setScreensaver(e.target.value)}>
            {screensaverOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Row>
        {screensaver !== 'Nenhum' && (
          <Row style={{ marginTop: 8 }}>
            <label>Tempo de espera:</label>
            <select
              value={screensaverTimeout}
              onChange={(e) => setScreensaverTimeout(Number(e.target.value))}
            >
              <option value={30}>30 segundos</option>
              <option value={60}>1 minuto</option>
              <option value={300}>5 minutos</option>
              <option value={600}>10 minutos</option>
              <option value={1800}>30 minutos</option>
            </select>
          </Row>
        )}
        <XpButton
          style={{ marginTop: 10 }}
          onClick={() => updateSettings({ wallpaper, visualStyle, screensaver, screensaverTimeout })}
        >
          Aplicar
        </XpButton>
      </fieldset>
      <fieldset style={{ marginTop: 12 }}>
        <legend>Esquema Visual</legend>
        <Row>
          <label>Estilo das janelas:</label>
          <select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value as any)}>
            {visualStyles.map((s) => <option key={s.value} value={s.value}>{s.name}</option>)}
          </select>
        </Row>
        <StylePreview $style={visualStyle}>
          <div className="preview-window">
            <div className="preview-titlebar">Janela de exemplo</div>
            <div className="preview-content">Conteúdo</div>
          </div>
        </StylePreview>
      </fieldset>
    </Section>
  )
}

const NetworkView: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings()
  const openApp = useOpenApp()
  const stateLabel = settings.networkConnected ? 'Conectado' : 'Desconectado'

  return (
    <Section>
      <h3>Rede e Internet</h3>
      <fieldset>
        <legend>Estado da rede</legend>
        <Status $ok={settings.networkConnected}>{stateLabel}</Status>
        <Row>
          <XpButton onClick={() => updateSettings({ networkConnected: !settings.networkConnected })}>
            {settings.networkConnected ? 'Desconectar' : 'Conectar'}
          </XpButton>
          <XpButton onClick={() => openApp('ie')}>Abrir Internet Explorer</XpButton>
        </Row>
      </fieldset>
    </Section>
  )
}

const SoundView: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings()

  const liveVolume = settings.muted ? 0 : settings.volume

  const preview = (): void => {
    setAudioPreferences(settings.volume, settings.muted)
    playSound(Sounds.logon, 0.7)
  }

  return (
    <Section>
      <h3>Sons e Áudio</h3>
      <fieldset>
        <legend>Volume global do sistema</legend>
        <Row>
          <label>Volume:</label>
          <input
            type="range"
            min={0}
            max={100}
            value={liveVolume}
            onChange={(e) => updateSettings({ volume: Number(e.target.value), muted: false })}
          />
          <span>{settings.muted ? 'Mudo' : `${settings.volume}%`}</span>
        </Row>
        <Row>
          <label>
            <input
              type="checkbox"
              checked={settings.muted}
              onChange={(e) => updateSettings({ muted: e.target.checked })}
            />{' '}
            Sem som
          </label>
        </Row>
        <Row>
          <XpButton onClick={preview}>Testar som</XpButton>
        </Row>
      </fieldset>
    </Section>
  )
}

const UsersView: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings()
  const [username, setUsername] = useState(settings.username)
  const [isAdmin, setIsAdmin] = useState(settings.isAdmin)

  return (
    <Section>
      <h3>Contas de Usuário</h3>
      <fieldset>
        <legend>Usuário da sessão</legend>
        <Row>
          <label>Nome:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Row>
        <Row>
          <label>
            <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} /> Administrador
          </label>
        </Row>
        <XpButton onClick={() => updateSettings({ username, isAdmin })}>Aplicar</XpButton>
      </fieldset>
    </Section>
  )
}

const AccessibilityView: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings()
  const [boldLetters, setBoldLetters] = useState(settings.boldLetters)
  const [highContrast, setHighContrast] = useState(settings.highContrast)
  const [narrator, setNarrator] = useState(settings.narrator)
  const [language, setLanguage] = useState(settings.language)

  return (
    <Section>
      <h3>Acessibilidade e Idioma</h3>
      <fieldset>
        <legend>Configurações Visuais</legend>
        <Row>
          <label><input type="checkbox" checked={boldLetters} onChange={(e) => setBoldLetters(e.target.checked)} /> Letras em Negrito</label>
        </Row>
        <Row>
          <label><input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} /> Alto contraste</label>
        </Row>
        <Row>
          <label><input type="checkbox" checked={narrator} onChange={(e) => setNarrator(e.target.checked)} /> Narrador</label>
        </Row>
      </fieldset>
      <fieldset style={{ marginTop: 10 }}>
        <legend>Tradução Automática Instantânea</legend>
        <Row>
          <label>Idioma:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="pt">Português</option>
            <option value="zh">中文 (Chinês)</option>
          </select>
        </Row>
        <p style={{ fontSize: 11, color: '#666', marginTop: 5 }}>
          Apenas Português e Chinês estão disponíveis nesta versão.
        </p>
      </fieldset>
      <XpButton style={{ marginTop: 10 }} onClick={() => updateSettings({ boldLetters, highContrast, narrator, language })}>Aplicar</XpButton>
    </Section>
  )
}

const ToolsView: React.FC = () => {
  const openApp = useOpenApp()
  const tools = useMemo(
    () => [
      { id: 'myComputer', label: 'Meu Computador' },
      { id: 'securityCenter', label: 'Central de Segurança' },
      { id: 'ie', label: 'Internet Explorer' },
      { id: 'run', label: 'Executar' },
      { id: 'search', label: 'Pesquisar' }
    ],
    []
  )

  return (
    <Section>
      <h3>Ferramentas do Sistema</h3>
      <fieldset>
        <legend>Abrir utilitários</legend>
        <ToolGrid>
          {tools.map((tool) => (
            <XpButton key={tool.id} onClick={() => openApp(tool.id)}>{tool.label}</XpButton>
          ))}
        </ToolGrid>
      </fieldset>
    </Section>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ece9d8;
`

const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`

const LeftPanel = styled.aside<{ $gradient: string }>`
  width: 220px;
  border-right: 1px solid #9db8d2;
  background: ${(p) => p.$gradient};
  padding: 10px;
  overflow: auto;
`

const PanelTitle = styled.h4<{ $color?: string }>`
  margin: 0 0 8px;
  color: ${(p) => p.$color || '#073a84'};
  font-size: 13px;
`

const NavBtn = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  background: transparent;
  padding: 5px 6px;
  font-size: 11px;
  cursor: pointer;
  &:hover { border-color: #9eb6ce; background: #ebf4ff; }
`

const Separator = styled.div`
  height: 1px;
  background: #b7cde5;
  margin: 8px 0;
`

const ContentArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
`

const Banner = styled.div`
  grid-column: 1 / 3;
  border: 1px solid #c9def3;
  background: linear-gradient(180deg, #fff 0%, #e9f2ff 100%);
  border-radius: 4px;
  padding: 10px 14px;
  h2 { margin: 0; color: #003fa0; }
  p { margin: 3px 0 0; color: #4b596c; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 12px;
`

const Card = styled.button`
  border: 1px solid #d0def0;
  border-radius: 4px;
  background: #fff;
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: left;
  padding: 10px;
  cursor: pointer;
  img { width: 40px; height: 40px; object-fit: contain; }
  strong { color: #0a3f90; font-size: 12px; }
  p { margin: 2px 0 0; color: #37495f; font-size: 11px; }
  &:hover { background: #f4f8ff; }
`

const Section = styled.div`
  padding: 14px;
  h3 { margin: 0 0 12px; color: #083a86; }
  fieldset {
    border: 1px solid #bfcad5;
    border-radius: 4px;
    margin: 0;
    padding: 8px 10px;
  }
  legend { color: #083a86; font-weight: bold; font-size: 11px; }
  input[type='text'], input:not([type]), select {
    border: 1px solid #7f9db9;
    padding: 2px 4px;
    font-size: 11px;
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
`

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const Status = styled.div<{ $ok: boolean }>`
  font-weight: bold;
  color: ${(p) => (p.$ok ? '#1f7f00' : '#a80000')};
  margin: 4px 0 6px;
`

const StylePreview = styled.div<{ $style: string }>`
  margin-top: 12px;
  .preview-window {
    width: 180px;
    border: 2px solid ${(p) =>
      p.$style === 'high-contrast-black' ? '#fff' :
      p.$style === 'high-contrast-white' ? '#000' :
      p.$style === 'high-contrast-1' ? '#ffff00' :
      p.$style === 'high-contrast-2' ? '#00ffff' :
      '#0831d9'};
    border-radius: ${(p) => p.$style === 'xp' ? '8px 8px 0 0' : '0'};
    overflow: hidden;
    box-shadow: ${(p) => p.$style === 'classic' ? '2px 2px 0 #808080' : '2px 2px 8px rgba(0,0,0,0.3)'};
    background: ${(p) =>
      p.$style === 'high-contrast-black' ? '#000' :
      p.$style === 'high-contrast-1' ? '#000' :
      p.$style === 'high-contrast-2' ? '#000' :
      '#ece9d8'};
  }
  .preview-titlebar {
    height: 22px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    font-size: 11px;
    font-weight: bold;
    color: ${(p) =>
      p.$style === 'high-contrast-black' ? '#fff' :
      p.$style === 'high-contrast-white' ? '#000' :
      p.$style === 'high-contrast-1' ? '#ffff00' :
      p.$style === 'high-contrast-2' ? '#00ffff' :
      '#fff'};
    background: ${(p) =>
      p.$style === 'xp' ? 'linear-gradient(180deg, #0058ee 0%, #3a93ff 50%, #0058ee 100%)' :
      p.$style === 'classic' ? 'linear-gradient(180deg, #1084d0 0%, #1084d0 100%)' :
      p.$style === 'high-contrast-white' ? '#fff' :
      p.$style === 'high-contrast-black' ? '#000' :
      p.$style === 'high-contrast-1' ? '#000080' :
      p.$style === 'high-contrast-2' ? '#008080' :
      '#0058ee'};
    border-bottom: ${(p) =>
      p.$style === 'high-contrast-white' ? '1px solid #000' :
      p.$style === 'high-contrast-black' ? '1px solid #fff' :
      '1px solid #0831d9'};
  }
  .preview-content {
    padding: 8px;
    font-size: 10px;
    color: ${(p) =>
      p.$style === 'high-contrast-black' ? '#fff' :
      p.$style === 'high-contrast-1' ? '#fff' :
      p.$style === 'high-contrast-2' ? '#fff' :
      '#000'};
  }
`

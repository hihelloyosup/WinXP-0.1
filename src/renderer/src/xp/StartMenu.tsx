import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Icon } from './icons'
import { theme } from './theme'
import { useOpenApp } from './WindowSystem'
import { useVirtualFS } from './VirtualFileSystem'
import { useTranslation } from './useTranslation'

interface Props {
  username: string
  onClose: () => void
  onShutdown: () => void
}

export const StartMenu: React.FC<Props> = ({ username, onClose, onShutdown }) => {
  const ref = useRef<HTMLDivElement>(null)
  const openApp = useOpenApp()
  const { files } = useVirtualFS()
  const [allProgramsOpen, setAllProgramsOpen] = useState(false)
  const { t } = useTranslation()

  const isAppActive = (appId: string) => {
    const requiresExe = ['paint', 'notepad', 'cmd', 'ie']
    if (requiresExe.includes(appId)) {
      return files.some(f => f.appId === appId && f.name?.toLowerCase().endsWith('.exe') && f.deletedAt === undefined)
    }
    return true
  }

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (!ref.current) return
      if (ref.current.contains(e.target as Node)) return
      const t = e.target as HTMLElement | null
      if (t && t.closest && t.closest('[data-xp-start-btn="1"]')) return
      onClose()
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [onClose])

  const openAndClose = (id: string): void => {
    openApp(id)
    onClose()
  }

  return (
    <Root ref={ref}>
      <UserBar>
        <UserPic src={Icon.user} />
        <UserName>{username}</UserName>
      </UserBar>
      <Body>
        <Left>
          <SectionTitle>Internet</SectionTitle>
          {isAppActive('ie') && (
            <MenuItem onClick={() => openAndClose('ie')}>
              <MenuIcon src={Icon.ie16} /> <div>
                <b>Internet</b><br />
                <small>Internet Explorer</small>
              </div>
            </MenuItem>
          )}
          <MenuItem onClick={() => openAndClose('outlook')}>
            <MenuIcon src={Icon.outlook16} /> <div>
              <b>E-mail</b><br />
              <small>Outlook Express</small>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => openAndClose('mediaPlayer')}>
            <MenuIcon src={Icon.mediaPlayer16} /> Windows Media Player
          </MenuItem>
          <MenuItem onClick={() => openAndClose('msn')}>
            <MenuIcon src={Icon.msn16} /> MSN Explorer
          </MenuItem>
          {isAppActive('notepad') && (
            <MenuItem onClick={() => openAndClose('notepad')}>
              <MenuIcon src={Icon.notepad16} /> Bloco de Notas
            </MenuItem>
          )}
          {isAppActive('paint') && (
            <MenuItem onClick={() => openAndClose('paint')}>
              <MenuIcon src={Icon.paint16} /> Paint
            </MenuItem>
          )}
          <MenuItem onClick={() => openAndClose('calculator')}>
            <MenuIcon src={Icon.calculator16} /> Calculadora
          </MenuItem>
          <MenuItem onClick={() => openAndClose('minesweeper')}>
            <MenuIcon src={Icon.mine} /> Campo Minado
          </MenuItem>
          <MenuItem onClick={() => openAndClose('solitaire')}>
            <MenuIcon src={Icon.solitaire} /> Paciência
          </MenuItem>
          <MenuItem onClick={() => openAndClose('about')}>
            <MenuIcon src={Icon.info16} /> Sobre o Windows
          </MenuItem>
          <Divider />
          <AllPrograms onClick={() => setAllProgramsOpen((v) => !v)}>
            <b>{t('Programs')}</b> <Arrow>▶</Arrow>
          </AllPrograms>
          {allProgramsOpen && (
            <AllProgramsPanel>
              {[
                { id: 'notepad', label: 'Bloco de Notas', icon: Icon.notepad16 },
                { id: 'paint', label: 'Paint', icon: Icon.paint16 },
                { id: 'calculator', label: 'Calculadora', icon: Icon.calculator16 },
                { id: 'mediaPlayer', label: 'Windows Media Player', icon: Icon.mediaPlayer16 },
                { id: 'minesweeper', label: 'Campo Minado', icon: Icon.mine },
                { id: 'solitaire', label: 'Paciência', icon: Icon.solitaire },
                { id: 'cmd', label: 'Prompt de Comando', icon: Icon.cmd16 }
              ]
                .filter((app) => isAppActive(app.id))
                .map((app) => (
                  <AllProgramItem key={app.id} onClick={() => openAndClose(app.id)}>
                    <MenuIcon src={app.icon} />
                    {app.label}
                  </AllProgramItem>
                ))}
            </AllProgramsPanel>
          )}
        </Left>

        <Right>
          <RightItem onClick={() => openAndClose('myComputer')}>
            <RightIcon src={Icon.myComputer32} /> {t('My Computer')}
          </RightItem>
          <RightItem onClick={() => openAndClose('myDocuments')}>
            <RightIcon src={Icon.myDocs32} /> Meus documentos
          </RightItem>
          <RightItem onClick={() => openAndClose('myPictures')}>
            <RightIcon src={Icon.myPictures32} /> Minhas imagens
          </RightItem>
          <RightItem onClick={() => openAndClose('recentDocs')}>
            <RightIcon src={Icon.folder32} /> Documentos recentes
          </RightItem>
          <Divider />
          <RightItem onClick={() => openAndClose('controlPanel')}>
            <RightIcon src={Icon.controlPanel32} /> {t('Control Panel')}
          </RightItem>
          <RightItem onClick={() => openAndClose('printers')}>
            <RightIcon src={Icon.printer32} /> Impressoras e aparelhos
          </RightItem>
          <RightItem onClick={() => openAndClose('help')}>
            <RightIcon src={Icon.help32} /> Ajuda e suporte
          </RightItem>
          <RightItem onClick={() => openAndClose('search')}>
            <RightIcon src={Icon.search32} /> Pesquisar
          </RightItem>
          <RightItem onClick={() => openAndClose('run')}>
            <RightIcon src={Icon.run32} /> Executar...
          </RightItem>
        </Right>
      </Body>

      <Bottom>
        <BottomBtn onClick={() => onShutdown()}>
          <BottomIcon src={Icon.logoff32} /> {t('Log Off')}
        </BottomBtn>
        <BottomBtn onClick={onShutdown}>
          <BottomIcon src={Icon.shutdown} /> {t('Turn Off Computer')}
        </BottomBtn>
      </Bottom>
    </Root>
  )
}

const Root = styled.div`
  position: fixed;
  bottom: 30px;
  left: 0;
  width: 380px;
  max-height: calc(100vh - 30px);
  display: flex;
  flex-direction: column;
  background: #ece9d8;
  border: 1px solid #0831d9;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  box-shadow: 2px -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1100;
  font-family: ${theme.fonts.ui};
  font-size: 11px;
  overflow: hidden;
`

const UserBar = styled.div`
  height: 54px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: linear-gradient(180deg, #1d6bd9 0%, #3a8fef 15%, #1d6bd9 100%);
  color: #fff;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.4);
  border-bottom: 2px solid #ff9900;
  box-shadow: 0 2px 0 #ffd27c;
`

const UserPic = styled.img`
  width: 42px;
  height: 42px;
  border: 2px solid #fff;
  border-radius: 3px;
  image-rendering: pixelated;
`

const UserName = styled.div`
  font-size: 15px;
  font-weight: bold;
`

const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`

const Left = styled.div`
  flex: 1;
  background: #fff;
  padding: 4px 2px;
  overflow-y: auto;
`

const Right = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #d3e5f6 0%, #a8c1e0 100%);
  padding: 4px 2px;
  overflow-y: auto;
`

const SectionTitle = styled.div`
  font-size: 10px;
  color: #666;
  padding: 2px 10px;
  text-transform: uppercase;
`

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  color: #000;
  small { color: #666; font-size: 10px; }
  &:hover {
    background: ${theme.colors.selection};
    color: #fff;
    small { color: #cfe0ff; }
  }
`

const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`

const Divider = styled.div`
  height: 1px;
  background: #c0c0c0;
  margin: 4px 8px;
`

const AllPrograms = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  font-size: 11px;
  cursor: pointer;
  &:hover { background: ${theme.colors.selection}; color: #fff; }
`

const AllProgramsPanel = styled.div`
  margin: 2px 8px 0 8px;
  border: 1px solid #94afcc;
  background: #fff;
`

const AllProgramItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  &:hover {
    background: ${theme.colors.selection};
    color: #fff;
  }
`

const Arrow = styled.span`
  font-size: 9px;
`

const RightItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  color: #003;
  &:hover { background: ${theme.colors.selection}; color: #fff; }
`

const RightIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`

const Bottom = styled.div`
  height: 42px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  background: linear-gradient(180deg, #d3e5f6 0%, #89aadd 100%);
  border-top: 1px solid #6b8dc3;
`

const BottomBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 11px;
  color: #000;
  &:hover { text-shadow: 0 0 1px #000; }
`

const BottomIcon = styled.img`
  width: 24px;
  height: 24px;
`

import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from '../icons'

interface Track {
  title: string
  artist: string
  duration: string
  album: string
  genre?: string
  year?: string
}

const LIBRARY: Track[] = [
  { title: 'Boot Windows XP', artist: 'Microsoft', duration: '0:04', album: 'Sons do Sistema', genre: 'Sistema', year: '2001' },
  { title: 'Logon Windows XP', artist: 'Microsoft', duration: '0:04', album: 'Sons do Sistema', genre: 'Sistema', year: '2001' },
  { title: 'Erro do Windows', artist: 'Microsoft', duration: '0:02', album: 'Sons do Sistema', genre: 'Sistema', year: '2001' },
  { title: 'Meu CD #1 - Faixa 1', artist: 'Vários Artistas', duration: '3:21', album: 'CD Pessoal', genre: 'Pop', year: '2004' },
  { title: 'Meu CD #1 - Faixa 2', artist: 'Vários Artistas', duration: '4:05', album: 'CD Pessoal', genre: 'Rock', year: '2004' },
  { title: 'Meu CD #1 - Faixa 3', artist: 'Vários Artistas', duration: '2:58', album: 'CD Pessoal', genre: 'MPB', year: '2004' },
  { title: 'Start Me Up', artist: 'Rolling Stones', duration: '3:33', album: 'Tattoo You', genre: 'Rock', year: '1981' },
  { title: 'I Want It That Way', artist: 'Backstreet Boys', duration: '3:33', album: 'Millennium', genre: 'Pop', year: '1999' },
  { title: 'Oops!...I Did It Again', artist: 'Britney Spears', duration: '3:31', album: 'Oops!...I Did It Again', genre: 'Pop', year: '2000' }
]

interface RadioStation {
  name: string
  genre: string
  quality: string
}

const RADIO_STATIONS: RadioStation[] = [
  { name: 'MSN Radio - Pop Hits', genre: 'Pop', quality: '128kbps' },
  { name: 'MSN Radio - Rock Classic', genre: 'Rock', quality: '128kbps' },
  { name: 'MSN Radio - Jazz Smooth', genre: 'Jazz', quality: '96kbps' },
  { name: 'MSN Radio - Dance Mix', genre: 'Eletrônica', quality: '192kbps' },
  { name: 'MSN Radio - Notícias', genre: 'Notícias', quality: '64kbps' }
]

type ViewMode = 'nowplaying' | 'library' | 'radio' | 'copycd'

export const MediaPlayer: React.FC = () => {
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [view, setView] = useState<ViewMode>('nowplaying')
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [volume, setVolume] = useState(70)
  const [playlist, setPlaylist] = useState<Track[]>(LIBRARY)
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const ref = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    ref.current = window.setInterval(() => {
      setPos((p) => {
        if (p >= 100) {
          if (repeat) {
            return 0
          }
          if (shuffle) {
            setSelected(Math.floor(Math.random() * playlist.length))
            return 0
          }
          if (selected < playlist.length - 1) {
            setSelected((s) => s + 1)
            return 0
          }
          setPlaying(false)
          return 100
        }
        return p + 1
      })
    }, 200)
    return () => {
      if (ref.current) window.clearInterval(ref.current)
    }
  }, [playing, repeat, shuffle, selected, playlist.length])

  const handlePlayTrack = (index: number) => {
    setSelected(index)
    setPos(0)
    setPlaying(true)
    setCurrentRadio(null)
  }

  const handleRadioPlay = (station: RadioStation) => {
    setCurrentRadio(station)
    setPlaying(true)
    setPos(0)
  }

  const filteredLibrary = searchTerm
    ? LIBRARY.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.album.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : LIBRARY

  const renderLibraryView = () => (
    <LibraryContainer>
      <SearchRow>
        <span>🔍</span>
        <SearchInput
          type="text"
          placeholder="Buscar na biblioteca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span>{filteredLibrary.length} faixas</span>
      </SearchRow>
      <LibraryList>
        <LibHeader>
          <div style={{ flex: 3 }}>Título</div>
          <div style={{ flex: 2 }}>Artista</div>
          <div style={{ flex: 2 }}>Álbum</div>
          <div style={{ flex: 1 }}>Gênero</div>
          <div style={{ flex: 1 }}>Ano</div>
          <div style={{ flex: 1 }}>Tempo</div>
        </LibHeader>
        {filteredLibrary.map((t, i) => (
          <LibRow
            key={i}
            $selected={playlist[selected]?.title === t.title}
            onClick={() => {
              const idx = playlist.findIndex(p => p.title === t.title)
              if (idx >= 0) setSelected(idx)
            }}
            onDoubleClick={() => handlePlayTrack(playlist.findIndex(p => p.title === t.title))}
          >
            <div style={{ flex: 3 }}>{t.title}</div>
            <div style={{ flex: 2 }}>{t.artist}</div>
            <div style={{ flex: 2 }}>{t.album}</div>
            <div style={{ flex: 1 }}>{t.genre}</div>
            <div style={{ flex: 1 }}>{t.year}</div>
            <div style={{ flex: 1 }}>{t.duration}</div>
          </LibRow>
        ))}
      </LibraryList>
    </LibraryContainer>
  )

  const renderRadioView = () => (
    <RadioContainer>
      <RadioHeader>🎵 MSN Radio Tuner - Estações Disponíveis</RadioHeader>
      {RADIO_STATIONS.map((station, i) => (
        <RadioStationRow
          key={i}
          $active={currentRadio?.name === station.name}
          onClick={() => handleRadioPlay(station)}
        >
          <RadioIcon>📻</RadioIcon>
          <RadioInfo>
            <RadioName>{station.name}</RadioName>
            <RadioMeta>{station.genre} • {station.quality}</RadioMeta>
          </RadioInfo>
          <PlayBtn>{currentRadio?.name === station.name && playing ? '⏸' : '▶'}</PlayBtn>
        </RadioStationRow>
      ))}
    </RadioContainer>
  )

  const renderCopyCDView = () => (
    <CopyCDContainer>
      <CDIcon>💿</CDIcon>
      <CDText>Insira um CD de áudio para copiar faixas para o computador</CDText>
      <CDButton onClick={() => alert('Funcionalidade simulada: CD copiado!')}>Copiar do CD</CDButton>
      <CDDivider />
      <CDText>Selecione faixas para gravar em CD</CDText>
      <CDTrackList>
        {LIBRARY.slice(0, 5).map((t, i) => (
          <CDTrack key={i}>
            <input type="checkbox" defaultChecked={i < 3} />
            <span>{t.title} - {t.artist}</span>
          </CDTrack>
        ))}
      </CDTrackList>
      <CDButton onClick={() => alert('Funcionalidade simulada: Gravação iniciada!')}>Gravar no CD</CDButton>
    </CopyCDContainer>
  )

  return (
    <Root>
      <Sidebar>
        <SideHeader>Now Playing</SideHeader>
        <SideItem $active={view === 'nowplaying'} onClick={() => setView('nowplaying')}>
          <img src={Icon.mediaPlayer16} alt="" /> Now Playing
        </SideItem>
        <SideItem $active={view === 'library'} onClick={() => setView('library')}>
          <img src={Icon.folder} alt="" /> Library
        </SideItem>
        <SideItem $active={view === 'radio'} onClick={() => setView('radio')}>
          <img src={Icon.earth} alt="" /> Radio Tuner
        </SideItem>
        <SideItem $active={view === 'copycd'} onClick={() => setView('copycd')}>
          <img src={Icon.mediaPlayer16} alt="" /> Copy from CD
        </SideItem>
        <SideItem $active={view === 'copycd'} onClick={() => setView('copycd')}>
          <img src={Icon.folder} alt="" /> Copy to CD
        </SideItem>
      </Sidebar>
      <Main>
        {view === 'nowplaying' && (
          <>
            <Visualizer $playing={playing}>
              <Bar delay={0} />
              <Bar delay={0.15} />
              <Bar delay={0.3} />
              <Bar delay={0.45} />
              <Bar delay={0.6} />
              <Bar delay={0.2} />
              <Bar delay={0.35} />
              <Bar delay={0.5} />
              <Bar delay={0.05} />
              <Bar delay={0.25} />
            </Visualizer>
            <Playlist>
              <PlHeader>
                <div style={{ flex: 3 }}>Title</div>
                <div style={{ flex: 2 }}>Artist</div>
                <div style={{ flex: 2 }}>Album</div>
                <div style={{ flex: 1 }}>Time</div>
              </PlHeader>
              {playlist.map((t, i) => (
                <PlRow
                  key={i}
                  $selected={selected === i}
                  onClick={() => setSelected(i)}
                  onDoubleClick={() => handlePlayTrack(i)}
                >
                  <div style={{ flex: 3 }}>{playing && selected === i ? '▶ ' : ''}{t.title}</div>
                  <div style={{ flex: 2 }}>{t.artist}</div>
                  <div style={{ flex: 2 }}>{t.album}</div>
                  <div style={{ flex: 1 }}>{t.duration}</div>
                </PlRow>
              ))}
            </Playlist>
          </>
        )}
        {view === 'library' && renderLibraryView()}
        {view === 'radio' && renderRadioView()}
        {view === 'copycd' && renderCopyCDView()}
        <Controls>
          <NowPlaying>
            {playing ? '▶' : '⏸'} {currentRadio ? `📻 ${currentRadio.name}` : `${playlist[selected]?.title} — ${playlist[selected]?.artist}`}
          </NowPlaying>
          <ProgressOuter>
            <ProgressInner style={{ width: `${pos}%` }} />
          </ProgressOuter>
          <ButtonsRow>
            <CtrlBtn onClick={() => setSelected((s) => Math.max(0, s - 1))}>⏮</CtrlBtn>
            <CtrlBtn onClick={() => setPlaying((p) => !p)}>
              {playing ? '⏸' : '▶'}
            </CtrlBtn>
            <CtrlBtn onClick={() => { setPlaying(false); setPos(0) }}>⏹</CtrlBtn>
            <CtrlBtn onClick={() => {
              if (shuffle) {
                setSelected(Math.floor(Math.random() * playlist.length))
              } else {
                setSelected((s) => Math.min(playlist.length - 1, s + 1))
              }
              setPos(0)
            }}>⏭</CtrlBtn>
            <ModeBtn $active={shuffle} onClick={() => setShuffle(!shuffle)}>🔀</ModeBtn>
            <ModeBtn $active={repeat} onClick={() => setRepeat(!repeat)}>🔁</ModeBtn>
            <Vol>
              <span>{volume > 50 ? '🔊' : volume > 0 ? '🔉' : '🔇'}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
              <span>{volume}%</span>
            </Vol>
          </ButtonsRow>
        </Controls>
      </Main>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: linear-gradient(180deg, #2a4aa8 0%, #0a1854 100%);
  color: #ddd;
  font-family: Tahoma, sans-serif;
`

const Sidebar = styled.div`
  width: 150px;
  background: linear-gradient(180deg, #1a2e7a 0%, #071142 100%);
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SideHeader = styled.div`
  font-weight: bold;
  color: #ffd27c;
  padding: 4px 8px;
  font-size: 12px;
`

const SideItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  border-radius: 3px;
  background: ${(p) => (p.$active ? 'linear-gradient(180deg, #4a88ef 0%, #214ec7 100%)' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#ccd')};
  img { width: 16px; height: 16px; }
  &:hover { background: rgba(255,255,255,0.1); color: #fff; }
`

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  gap: 8px;
`

const Visualizer = styled.div<{ $playing: boolean }>`
  height: 120px;
  background: #000;
  border: 2px solid #5a7de0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 6px;
  opacity: ${(p) => (p.$playing ? 1 : 0.6)};
`

const grow = keyframes`
  0% { height: 6px; }
  100% { height: 100%; }
`

const Bar = styled.div<{ delay: number }>`
  width: 10%;
  background: linear-gradient(0deg, #07f 0%, #4af 60%, #fff 100%);
  animation: ${grow} 0.6s ease-in-out alternate infinite;
  animation-delay: ${(p) => p.delay}s;
  height: 20%;
`

const Playlist = styled.div`
  flex: 1;
  background: #fff;
  color: #000;
  border: 1px solid #5a7de0;
  overflow: auto;
  font-size: 11px;
`

const PlHeader = styled.div`
  display: flex;
  font-weight: bold;
  background: linear-gradient(180deg, #fafafa 0%, #ece9d8 100%);
  border-bottom: 1px solid #b3b3b3;
  padding: 2px 6px;
  & > div { padding: 0 4px; }
`

const PlRow = styled.div<{ $selected: boolean }>`
  display: flex;
  padding: 2px 6px;
  background: ${(p) => (p.$selected ? '#316ac5' : 'transparent')};
  color: ${(p) => (p.$selected ? '#fff' : '#000')};
  cursor: default;
  & > div { padding: 0 4px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
`

const Controls = styled.div`
  background: linear-gradient(180deg, #1e3a9e 0%, #0a1854 100%);
  border: 1px solid #ffd27c;
  border-radius: 4px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const NowPlaying = styled.div`
  color: #ffd27c;
  font-size: 11px;
`

const ProgressOuter = styled.div`
  height: 10px;
  background: rgba(255,255,255,0.12);
  border: 1px solid #5a7de0;
  border-radius: 10px;
  overflow: hidden;
`

const ProgressInner = styled.div`
  height: 100%;
  background: linear-gradient(0deg, #002d8a 0%, #3f87ff 50%, #fff 100%);
  transition: width 0.2s linear;
`

const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const CtrlBtn = styled.button`
  width: 36px;
  height: 28px;
  background: linear-gradient(180deg, #1b6cc5 0%, #093a87 100%);
  color: #fff;
  border: 1px solid #ffd27c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  &:hover { filter: brightness(1.15); }
`

const Vol = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  color: #ffd27c;
  font-size: 11px;
`

const ModeBtn = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 28px;
  background: ${(p) => (p.$active ? 'linear-gradient(180deg, #ff9900 0%, #c67300 100%)' : 'linear-gradient(180deg, #1b6cc5 0%, #093a87 100%)')};
  color: #fff;
  border: 1px solid #ffd27c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  &:hover { filter: brightness(1.15); }
`

const LibraryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #000;
  border: 1px solid #5a7de0;
  overflow: hidden;
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: linear-gradient(180deg, #fafafa 0%, #ece9d8 100%);
  border-bottom: 1px solid #b3b3b3;
  font-size: 11px;
`

const SearchInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #7f9db9;
  font-size: 11px;
`

const LibraryList = styled.div`
  flex: 1;
  overflow: auto;
`

const LibHeader = styled.div`
  display: flex;
  font-weight: bold;
  background: linear-gradient(180deg, #fafafa 0%, #ece9d8 100%);
  border-bottom: 1px solid #b3b3b3;
  padding: 4px 6px;
  font-size: 11px;
  & > div { padding: 0 4px; }
`

const LibRow = styled.div<{ $selected: boolean }>`
  display: flex;
  padding: 4px 6px;
  background: ${(p) => (p.$selected ? '#316ac5' : 'transparent')};
  color: ${(p) => (p.$selected ? '#fff' : '#000')};
  font-size: 11px;
  cursor: default;
  border-bottom: 1px solid #f0f0f0;
  & > div { padding: 0 4px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  &:hover { background: ${(p) => (p.$selected ? '#316ac5' : '#e9e6d0')}; }
`

const RadioContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1a2e7a 0%, #071142 100%);
  overflow: auto;
  padding: 12px;
  gap: 8px;
`

const RadioHeader = styled.div`
  color: #ffd27c;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
`

const RadioStationRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: ${(p) => (p.$active ? 'linear-gradient(180deg, #4a88ef 0%, #214ec7 100%)' : 'rgba(255,255,255,0.08)')};
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$active ? '#5a7de0' : 'transparent')};
  &:hover { background: ${(p) => (p.$active ? 'linear-gradient(180deg, #4a88ef 0%, #214ec7 100%)' : 'rgba(255,255,255,0.15)')}; }
`

const RadioIcon = styled.div`
  font-size: 24px;
`

const RadioInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const RadioName = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: bold;
`

const RadioMeta = styled.div`
  color: #aab;
  font-size: 11px;
`

const PlayBtn = styled.div`
  color: #ffd27c;
  font-size: 16px;
`

const CopyCDContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a2e7a 0%, #071142 100%);
  padding: 20px;
  gap: 12px;
`

const CDIcon = styled.div`
  font-size: 48px;
`

const CDText = styled.div`
  color: #fff;
  font-size: 13px;
  text-align: center;
`

const CDButton = styled.button`
  padding: 8px 20px;
  background: linear-gradient(180deg, #ff9900 0%, #c67300 100%);
  color: #fff;
  border: 1px solid #ffd27c;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
`

const CDDivider = styled.div`
  width: 60%;
  height: 1px;
  background: rgba(255,255,255,0.2);
  margin: 8px 0;
`

const CDTrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 80%;
`

const CDTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 11px;
  padding: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
`

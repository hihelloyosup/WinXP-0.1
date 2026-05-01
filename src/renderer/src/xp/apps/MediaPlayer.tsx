import React, { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from '../icons'

interface Track {
  title: string
  artist: string
  duration: string
  album: string
}

const LIBRARY: Track[] = [
  { title: 'Boot Windows XP', artist: 'Microsoft', duration: '0:04', album: 'Sons do Sistema' },
  { title: 'Logon Windows XP', artist: 'Microsoft', duration: '0:04', album: 'Sons do Sistema' },
  { title: 'Erro do Windows', artist: 'Microsoft', duration: '0:02', album: 'Sons do Sistema' },
  { title: 'Meu CD #1 - Faixa 1', artist: 'Vários', duration: '3:21', album: 'CD pessoal' },
  { title: 'Meu CD #1 - Faixa 2', artist: 'Vários', duration: '4:05', album: 'CD pessoal' },
  { title: 'Meu CD #1 - Faixa 3', artist: 'Vários', duration: '2:58', album: 'CD pessoal' }
]

export const MediaPlayer: React.FC = () => {
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    ref.current = window.setInterval(() => {
      setPos((p) => {
        if (p >= 100) {
          setPlaying(false)
          return 100
        }
        return p + 1
      })
    }, 200)
    return () => {
      if (ref.current) window.clearInterval(ref.current)
    }
  }, [playing])

  return (
    <Root>
      <Sidebar>
        <SideHeader>Now Playing</SideHeader>
        <SideItem $active>
          <img src={Icon.mediaPlayer16} alt="" /> Now Playing
        </SideItem>
        <SideItem>
          <img src={Icon.folder} alt="" /> Library
        </SideItem>
        <SideItem>
          <img src={Icon.earth} alt="" /> Radio Tuner
        </SideItem>
        <SideItem>
          <img src={Icon.mediaPlayer16} alt="" /> Copy from CD
        </SideItem>
        <SideItem>
          <img src={Icon.folder} alt="" /> Copy to CD
        </SideItem>
      </Sidebar>
      <Main>
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
          {LIBRARY.map((t, i) => (
            <PlRow
              key={i}
              $selected={selected === i}
              onClick={() => setSelected(i)}
              onDoubleClick={() => {
                setSelected(i)
                setPos(0)
                setPlaying(true)
              }}
            >
              <div style={{ flex: 3 }}>{t.title}</div>
              <div style={{ flex: 2 }}>{t.artist}</div>
              <div style={{ flex: 2 }}>{t.album}</div>
              <div style={{ flex: 1 }}>{t.duration}</div>
            </PlRow>
          ))}
        </Playlist>
        <Controls>
          <NowPlaying>
            {playing ? '▶' : '⏸'} {LIBRARY[selected].title} — {LIBRARY[selected].artist}
          </NowPlaying>
          <ProgressOuter>
            <ProgressInner style={{ width: `${pos}%` }} />
          </ProgressOuter>
          <ButtonsRow>
            <CtrlBtn onClick={() => setSelected((s) => Math.max(0, s - 1))}>⏮</CtrlBtn>
            <CtrlBtn onClick={() => setPlaying((p) => !p)}>
              {playing ? '⏸' : '▶'}
            </CtrlBtn>
            <CtrlBtn onClick={() => setPlaying(false)}>⏹</CtrlBtn>
            <CtrlBtn onClick={() => setSelected((s) => Math.min(LIBRARY.length - 1, s + 1))}>⏭</CtrlBtn>
            <Vol>
              <span>🔊</span>
              <input type="range" min={0} max={100} defaultValue={70} />
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

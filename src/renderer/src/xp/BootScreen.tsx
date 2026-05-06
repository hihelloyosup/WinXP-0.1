import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

interface Props {
  onDone: () => void
  onF8?: () => void
  autoF8?: boolean
}

export const BootScreen: React.FC<Props> = ({ onDone, onF8, autoF8 }) => {
  const [phase, setPhase] = useState<'asus' | 'windows'>('asus')

  useEffect(() => {
    if (autoF8) {
      if (onF8) onF8()
      return
    }
    if (phase === 'asus') {
      const t = setTimeout(() => setPhase('windows'), 5000)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onDone, 5000)
      return () => clearTimeout(t)
    }
  }, [phase, onDone, autoF8, onF8])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8' && onF8) {
        onF8()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onF8])

  if (phase === 'asus') {
    return (
      <Root>
        <AsusContainer>
          <AsusLogoText>ASUS</AsusLogoText>
          <AsusSubText>IN SEARCH OF INCREDIBLE</AsusSubText>
        </AsusContainer>
      </Root>
    )
  }

  return (
    <Root>
      <Center>
        {/* Windows XP Logo — flag + text layout exactly like XP boot screen */}
        <XpLogoGroup>
          <FlagGrid>
            <FlagRed />
            <FlagGreen />
            <FlagBlue />
            <FlagYellow />
          </FlagGrid>
          <XpTextGroup>
            <MicrosoftText>Microsoft<Reg>®</Reg></MicrosoftText>
            <WindowsText>Windows<XpSuper>xp</XpSuper></WindowsText>
          </XpTextGroup>
        </XpLogoGroup>

        <ProgressOuter>
          <ProgressInner />
        </ProgressOuter>
      </Center>

      <BottomLeft>
        <div>Copyright © Microsoft Corporation</div>
      </BottomLeft>
      <BottomRight>
        <MicrosoftLogo>Microsoft</MicrosoftLogo>
      </BottomRight>
    </Root>
  )
}

const Root = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  color: #fff;
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
`

/* ——— XP Logo ——— */
const XpLogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

const FlagGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 3px;
  width: 76px;
  height: 76px;
  transform: perspective(300px) rotateY(-8deg) rotateX(4deg);
  filter: drop-shadow(2px 2px 6px rgba(0,0,0,0.7));
`

const FlagPane = styled.div`
  border-radius: 2px;
`

const FlagRed = styled(FlagPane)`
  background: radial-gradient(circle at 60% 40%, #ff6020, #cc2200);
`

const FlagGreen = styled(FlagPane)`
  background: radial-gradient(circle at 40% 40%, #88cc00, #448800);
`

const FlagBlue = styled(FlagPane)`
  background: radial-gradient(circle at 60% 60%, #3399ff, #0055cc);
`

const FlagYellow = styled(FlagPane)`
  background: radial-gradient(circle at 40% 60%, #ffdd00, #cc8800);
`

const XpTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.8));
`

const MicrosoftText = styled.div`
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`

const Reg = styled.span`
  font-size: 9px;
  vertical-align: super;
`

const WindowsText = styled.div`
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-size: 42px;
  font-weight: 300;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1;
  position: relative;
`

const XpSuper = styled.span`
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #ff6820;
  vertical-align: super;
  margin-left: 2px;
  letter-spacing: 0;
`

/* ——— Progress Bar ——— */
const ProgressOuter = styled.div`
  width: 220px;
  height: 14px;
  border: 1px solid #3a5a9a;
  border-radius: 7px;
  padding: 2px;
  background: #000;
  overflow: hidden;
`

const slide = keyframes`
  0% { transform: translateX(-70px); }
  100% { transform: translateX(230px); }
`

const ProgressInner = styled.div`
  height: 100%;
  width: 70px;
  background: linear-gradient(90deg, #1b3fc8 0%, #5588ff 40%, #3b6dff 70%, #1b3fc8 100%);
  animation: ${slide} 1.6s linear infinite;
  border-radius: 5px;
`

/* ——— Bottom labels ——— */
const BottomLeft = styled.div`
  position: absolute;
  bottom: 28px;
  left: 36px;
  font-size: 10px;
  color: #888;
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
`

const BottomRight = styled.div`
  position: absolute;
  bottom: 20px;
  right: 36px;
`

const MicrosoftLogo = styled.div`
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-style: italic;
  font-size: 20px;
  font-weight: bold;
  color: #aaa;
`

/* ——— ASUS screen ——— */
const AsusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const AsusLogoText = styled.div`
  font-family: 'Arial', sans-serif;
  color: #fff;
  font-size: 80px;
  font-weight: 900;
  letter-spacing: 4px;
  line-height: 1;
`

const AsusSubText = styled.div`
  font-family: 'Arial', sans-serif;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-top: 5px;
`

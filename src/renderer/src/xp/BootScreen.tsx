import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

interface Props {
  onDone: () => void
}

export const BootScreen: React.FC<Props> = ({ onDone }) => {
  const [phase, setPhase] = useState<'asus' | 'windows'>('asus')

  useEffect(() => {
    if (phase === 'asus') {
      const t = setTimeout(() => setPhase('windows'), 15000)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onDone, 5000)
      return () => clearTimeout(t)
    }
  }, [phase, onDone])

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
        <Logo>
          <Flag>
            <Pane $c="#ff3b30" />
            <Pane $c="#4cd964" />
            <Pane $c="#007aff" />
            <Pane $c="#ffcc00" />
          </Flag>
          <LogoText>
            Microsoft<span>®</span>
            <br />
            <BrandName>
              Windows<Sup>xp</Sup>
            </BrandName>
          </LogoText>
        </Logo>
        <ProgressOuter>
          <ProgressInner />
        </ProgressOuter>
      </Center>
      <Bottom>
        <div>Copyright © Microsoft Corporation</div>
        <Brand>Microsoft</Brand>
      </Bottom>
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const tilt = keyframes`
  0% { transform: skewY(-10deg) rotate(-2deg); filter: hue-rotate(0deg); }
  100% { transform: skewY(-10deg) rotate(2deg); filter: hue-rotate(12deg); }
`

const Flag = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  width: 64px;
  height: 52px;
  transform: skewY(-10deg);
  animation: ${tilt} 2.4s ease-in-out infinite alternate;
`

const Pane = styled.div<{ $c: string }>`
  background: ${(p) => p.$c};
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`

const LogoText = styled.div`
  font-size: 22px;
  line-height: 1.2;
  span { font-size: 10px; vertical-align: super; }
`

const BrandName = styled.span`
  font-size: 42px;
  font-weight: bold;
  letter-spacing: -1px;
`

const Sup = styled.span`
  font-size: 18px !important;
  vertical-align: super;
  color: #ff8c00;
  margin-left: 2px;
`

const ProgressOuter = styled.div`
  width: 220px;
  height: 16px;
  border: 1px solid #fff;
  border-radius: 3px;
  padding: 2px;
  background: #000;
  overflow: hidden;
`

const slide = keyframes`
  0% { transform: translateX(-60px); }
  100% { transform: translateX(220px); }
`

const ProgressInner = styled.div`
  display: flex;
  gap: 2px;
  height: 100%;
  width: 60px;
  background: repeating-linear-gradient(90deg, #1b3fc8 0 6px, #3b7dff 6px 12px, #1b3fc8 12px 14px);
  animation: ${slide} 1.6s linear infinite;
  border-radius: 2px;
`

const Bottom = styled.div`
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  font-size: 10px;
  color: #aaa;
`

const Brand = styled.div`
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-style: italic;
`

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

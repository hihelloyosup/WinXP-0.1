import React from 'react'
import styled from 'styled-components'
import { XpButton } from '../ui'
import { useWindows } from '../WindowSystem'
import type { AppInstance } from '../types'

export const About: React.FC<{ instance: AppInstance }> = ({ instance }) => {
  const { close } = useWindows()
  return (
    <Root>
      <Header>
        <FlagArt>
          <span style={{ background: '#ff3b30' }} />
          <span style={{ background: '#4cd964' }} />
          <span style={{ background: '#007aff' }} />
          <span style={{ background: '#ffcc00' }} />
        </FlagArt>
        <Title>
          Microsoft<sup>®</sup><br />
          <big>Windows<span>xp</span></big><br />
          Home Edition
        </Title>
      </Header>
      <Body>
        <p>
          Versão 5.1 (Build 2600.xpsp_sp3.080413-2111: Service Pack 3)
          <br />
          © 1985-2008 Microsoft Corporation. Todos os direitos reservados.
        </p>
        <hr />
        <p>
          Este produto está licenciado sob os termos do contrato de licença
          da Microsoft para:
        </p>
        <Licensed>Camilla</Licensed>
        <p>
          Memória física disponível para o Windows: <b>384 MB de RAM</b>
        </p>
      </Body>
      <Buttons>
        <XpButton onClick={() => close(instance.id)}>OK</XpButton>
      </Buttons>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: #ece9d8;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 11px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid #b3b3b3;
`

const FlagArt = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  width: 52px;
  height: 42px;
  transform: skewY(-10deg);
  span { display: block; border-radius: 2px; }
`

const Title = styled.div`
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 13px;
  big { font-size: 22px; font-weight: bold; }
  span { font-size: 12px; color: #f60; margin-left: 2px; vertical-align: super; }
  sup { font-size: 9px; }
`

const Body = styled.div`
  flex: 1;
  line-height: 1.5;
  p { margin: 4px 0; }
  hr { border: none; border-top: 1px solid #b3b3b3; }
`

const Licensed = styled.div`
  background: #fff;
  border: 1px solid #7f9db9;
  padding: 6px 10px;
  margin: 4px 0;
`

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`

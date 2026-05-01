import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { XpButton } from '../ui'

interface SecurityItem {
  id: string
  title: string
  desc: string
  status: 'on' | 'off' | 'warn'
  detail: string
}

const INITIAL_ITEMS: SecurityItem[] = [
  {
    id: 'firewall',
    title: 'Firewall',
    desc: 'O Firewall do Windows ajuda a proteger o computador impedindo que usuários não autorizados acessem o computador pela Internet ou por uma rede.',
    status: 'on',
    detail: 'O Firewall do Windows está ativado.'
  },
  {
    id: 'updates',
    title: 'Atualizações Automáticas',
    desc: 'O Windows pode verificar automaticamente se há atualizações importantes e instalá-las para você.',
    status: 'on',
    detail: 'As atualizações automáticas estão ativadas.'
  },
  {
    id: 'antivirus',
    title: 'Proteção contra vírus',
    desc: 'Software antivírus ajuda a proteger seu computador contra vírus e outras ameaças de segurança.',
    status: 'warn',
    detail: 'Não foi encontrado software antivírus.'
  }
]

export const SecurityCenter: React.FC = () => {
  const [items, setItems] = useState(INITIAL_ITEMS)

  const toggle = (id: string): void => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              status: it.status === 'on' ? 'off' : 'on',
              detail:
                it.status === 'on'
                  ? `${it.title} está desativado.`
                  : `${it.title} está ativado.`
            }
          : it
      )
    )
  }

  const overall = items.every((i) => i.status === 'on')
    ? 'PROTEGIDO'
    : items.some((i) => i.status === 'off')
      ? 'EM RISCO'
      : 'ATENÇÃO'

  const overallColor = overall === 'PROTEGIDO' ? '#2a8a00' : overall === 'EM RISCO' ? '#cc2200' : '#cc8800'

  return (
    <Root>
      <Header>
        <img src={Icon.security32} alt="" style={{ width: 40, height: 40 }} />
        <div>
          <h2>Central de Segurança do Windows</h2>
          <StatusBadge $color={overallColor}>{overall}</StatusBadge>
        </div>
      </Header>
      <Body>
        <Sidebar>
          <SideSection>
            <header>Recursos</header>
            <ul>
              <li>Windows Update</li>
              <li>Firewall do Windows</li>
              <li>Opções da Internet</li>
            </ul>
          </SideSection>
          <SideSection>
            <header>Informações</header>
            <ul>
              <li>Sobre a Central de Segurança</li>
              <li>Perguntas frequentes</li>
            </ul>
          </SideSection>
        </Sidebar>
        <Content>
          <InfoBar $color={overallColor}>
            <ShieldIcon $color={overallColor}>🛡</ShieldIcon>
            <div>
              <strong>Status geral: {overall}</strong>
              <p>
                {overall === 'PROTEGIDO'
                  ? 'Seu computador está protegido. Todas as configurações de segurança estão ativadas.'
                  : 'Verifique as configurações abaixo para proteger seu computador.'}
              </p>
            </div>
          </InfoBar>
          {items.map((item) => (
            <SecurityCard key={item.id}>
              <CardHeader>
                <StatusDot $status={item.status} />
                <CardTitle>{item.title}</CardTitle>
                <XpButton onClick={() => toggle(item.id)}>
                  {item.status === 'on' ? 'Desativar' : 'Ativar'}
                </XpButton>
              </CardHeader>
              <CardBody>
                <p>{item.desc}</p>
                <StatusText $status={item.status}>{item.detail}</StatusText>
              </CardBody>
            </SecurityCard>
          ))}
        </Content>
      </Body>
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ece9d8;
  font-family: Tahoma, sans-serif;
  font-size: 11px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: linear-gradient(180deg, #fff 0%, #e0dcc8 100%);
  border-bottom: 1px solid #b3b3b3;
  h2 { margin: 0; font-size: 16px; color: #003399; }
`

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-block;
  margin-top: 2px;
  padding: 1px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background: ${(p) => p.$color};
`

const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`

const Sidebar = styled.div`
  width: 170px;
  padding: 8px;
  background: linear-gradient(180deg, #7ba0ea 0%, #4b77ce 40%, #4b77ce 55%, #7ba0ea 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`

const SideSection = styled.div`
  background: linear-gradient(180deg, #fff 0%, #d4e4ff 100%);
  border-radius: 4px;
  padding: 4px 8px;
  color: #0a246a;
  header {
    font-weight: bold;
    padding: 2px 0;
    margin-bottom: 4px;
  }
  ul { list-style: none; margin: 0; padding: 0; }
  li { padding: 2px 0; cursor: pointer; }
  li:hover { text-decoration: underline; }
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const InfoBar = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 4px;
  border: 1px solid ${(p) => p.$color};
  background: ${(p) =>
    p.$color === '#2a8a00'
      ? 'linear-gradient(180deg, #e8ffe0 0%, #c0f0b0 100%)'
      : p.$color === '#cc2200'
        ? 'linear-gradient(180deg, #ffe0e0 0%, #f0b0b0 100%)'
        : 'linear-gradient(180deg, #fff8e0 0%, #f0e0a0 100%)'};
  strong { font-size: 12px; }
  p { margin: 2px 0 0; font-size: 11px; color: #333; }
`

const ShieldIcon = styled.div<{ $color: string }>`
  font-size: 28px;
  filter: ${(p) =>
    p.$color === '#2a8a00' ? 'hue-rotate(80deg)' : p.$color === '#cc2200' ? 'hue-rotate(0deg)' : 'hue-rotate(30deg)'};
`

const SecurityCard = styled.div`
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(180deg, #f8f8f4 0%, #ece9d8 100%);
  border-bottom: 1px solid #d0d0d0;
`

const StatusDot = styled.div<{ $status: 'on' | 'off' | 'warn' }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(p) =>
    p.$status === 'on' ? '#2a8a00' : p.$status === 'off' ? '#cc2200' : '#cc8800'};
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.5);
`

const CardTitle = styled.div`
  flex: 1;
  font-weight: bold;
  font-size: 12px;
  color: #003399;
`

const CardBody = styled.div`
  padding: 8px 12px;
  p { margin: 0 0 4px; color: #333; line-height: 1.4; }
`

const StatusText = styled.div<{ $status: 'on' | 'off' | 'warn' }>`
  font-weight: bold;
  color: ${(p) =>
    p.$status === 'on' ? '#2a8a00' : p.$status === 'off' ? '#cc2200' : '#cc8800'};
  margin-top: 4px;
`

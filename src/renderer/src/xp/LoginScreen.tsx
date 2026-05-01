import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from './icons'

interface Props {
  onLogin: (username: string) => void
}

const USERS = [
  { name: 'Camilla', icon: Icon.user, hint: 'A melhor usuária', password: '' },
  { name: 'Convidado', icon: Icon.user, hint: 'Sem senha', password: '' }
]

export const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [selected, setSelected] = useState<string | null>(USERS[0].name)
  const [password, setPassword] = useState('')

  return (
    <Root>
      <Header>
        <HeaderLeft>
          <SmallFlag>
            <span style={{ background: '#ff3b30' }} />
            <span style={{ background: '#4cd964' }} />
            <span style={{ background: '#007aff' }} />
            <span style={{ background: '#ffcc00' }} />
          </SmallFlag>
          <HeaderTitle>
            <span>To begin, click your user name</span>
          </HeaderTitle>
        </HeaderLeft>
        <HeaderRight>Windows<sup>xp</sup></HeaderRight>
      </Header>

      <UsersArea>
        <UsersList>
          {USERS.map((u) => (
            <UserCard
              key={u.name}
              $selected={selected === u.name}
              onClick={() => setSelected(u.name)}
            >
              <Avatar src={u.icon} />
              <UserInfo>
                <UserName>{u.name}</UserName>
                {selected === u.name && (
                  <>
                    <HintText>{u.hint}</HintText>
                    <InputRow onClick={(e) => e.stopPropagation()}>
                      <PasswordInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onLogin(u.name)
                        }}
                        placeholder="Type your password"
                      />
                      <GoBtn
                        onClick={() => onLogin(u.name)}
                        title="Enter"
                      >
                        →
                      </GoBtn>
                    </InputRow>
                  </>
                )}
              </UserInfo>
            </UserCard>
          ))}
        </UsersList>
      </UsersArea>

      <Footer>
        <TurnOff>
          <PowerCircle>⏻</PowerCircle>
          Turn off computer
        </TurnOff>
        <FooterHint>
          After you log on, you can add or change accounts.
          <br />
          Just go to Control Panel and click User Accounts.
        </FooterHint>
      </Footer>
    </Root>
  )
}

const Root = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  background: linear-gradient(135deg, #5a7edc 0%, #2160c4 45%, #1a4fa8 100%);
`

const Header = styled.div`
  flex: 0 0 110px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: linear-gradient(180deg, #4d88df 0%, #3472d2 60%, #245fc1 100%);
  border-bottom: 2px solid #ff9900;
  box-shadow: 0 2px 0 #ffd27c;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const SmallFlag = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  width: 38px;
  height: 32px;
  transform: skewY(-10deg);
  span {
    display: block;
    border-radius: 2px;
  }
`

const HeaderTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  span { font-weight: normal; font-size: 13px; opacity: 0.85; }
`

const HeaderRight = styled.div`
  font-size: 28px;
  font-weight: bold;
  letter-spacing: -1px;
  sup { font-size: 14px; color: #ff8c00; margin-left: 2px; }
`

const UsersArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UsersList = styled.div`
  width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const glow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
  100% { box-shadow: 0 0 0 3px rgba(255,255,255,0); }
`

const UserCard = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  background: ${(p) => (p.$selected ? 'rgba(255, 255, 255, 0.05)' : 'transparent')};
  &:hover { background: rgba(255,255,255,0.08); }
  animation: ${(p) => (p.$selected ? glow : 'none')} 1s ease-out;
`

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 3px;
  image-rendering: pixelated;
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.div`
  font-size: 20px;
  font-weight: bold;
`

const HintText = styled.div`
  font-size: 12px;
  opacity: 0.85;
  margin-top: 4px;
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
`

const PasswordInput = styled.input`
  padding: 4px 6px;
  border: 1px solid #5c8dd6;
  border-radius: 2px;
  width: 170px;
  font-size: 12px;
  color: #000;
`

const GoBtn = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #fff;
  color: #fff;
  background: radial-gradient(circle, #4a87da 0%, #1c54a8 100%);
  cursor: pointer;
  font-weight: bold;
  &:hover { filter: brightness(1.15); }
`

const Footer = styled.div`
  flex: 0 0 80px;
  background: linear-gradient(180deg, #245fc1 0%, #1a4fa8 100%);
  border-top: 2px solid #ff9900;
  box-shadow: inset 0 2px 0 #ffd27c;
  display: flex;
  align-items: center;
  padding: 0 40px;
  gap: 20px;
`

const TurnOff = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  &:hover { filter: brightness(1.2); }
`

const PowerCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(circle, #f6cf5e 0%, #d48e1c 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`

const FooterHint = styled.div`
  font-size: 11px;
  opacity: 0.85;
  line-height: 1.4;
`

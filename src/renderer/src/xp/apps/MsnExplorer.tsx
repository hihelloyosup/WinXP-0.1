import React from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'

export const MsnExplorer: React.FC = () => (
  <Root>
    <Top>
      <img src={Icon.msn} alt="MSN" />
      <h2>MSN Explorer 8</h2>
    </Top>
    <Welcome>
      <p>Bem-vindo ao MSN Explorer!</p>
      <p>Entre com seu MSN Passport para acessar seu e-mail, chat e notícias personalizadas.</p>
      <Form onSubmit={(e) => e.preventDefault()}>
        <label>Endereço Passport:</label>
        <input type="email" defaultValue="camilla@hotmail.com" />
        <label>Senha:</label>
        <input type="password" defaultValue="••••••••" />
        <Entrar>Entrar no MSN</Entrar>
      </Form>
    </Welcome>
    <NewsStrip>
      <strong>Manchetes de hoje:</strong>
      <span>• Windows XP Service Pack 2 já disponível</span>
      <span>• Novo sistema de busca do MSN</span>
      <span>• Dica: use atalhos de teclado para ser mais produtivo</span>
    </NewsStrip>
  </Root>
)

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0066cc 0%, #003a7a 100%);
  color: #fff;
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
`

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: linear-gradient(180deg, #008ce4 0%, #0066cc 100%);
  border-bottom: 2px solid #ff9900;
  img { width: 48px; height: 48px; }
  h2 { margin: 0; font-size: 18px; }
`

const Welcome = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-align: center;
  p { max-width: 380px; }
`

const Form = styled.form`
  background: rgba(255,255,255,0.1);
  padding: 14px 18px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 280px;
  label { font-size: 11px; text-align: left; }
  input {
    padding: 4px 6px;
    border: 1px solid #fff;
    background: #fff;
    color: #000;
    font-size: 12px;
  }
`

const Entrar = styled.button`
  margin-top: 8px;
  padding: 6px 12px;
  background: linear-gradient(180deg, #ff9900 0%, #c67300 100%);
  color: #fff;
  border: 1px solid #ffd27c;
  border-radius: 3px;
  font-weight: bold;
  cursor: pointer;
`

const NewsStrip = styled.div`
  padding: 6px 12px;
  background: rgba(0,0,0,0.25);
  display: flex;
  gap: 16px;
  font-size: 11px;
  overflow-x: auto;
  white-space: nowrap;
`

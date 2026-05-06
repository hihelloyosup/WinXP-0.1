import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'

interface NewsItem {
  title: string
  category: string
  time: string
}

const NEWS_ITEMS: NewsItem[] = [
  { title: 'Windows XP Service Pack 2 já disponível para download', category: 'Tecnologia', time: '10:30' },
  { title: 'Novo MSN Messenger 7.0 com winks e emoticons animados', category: 'Software', time: '09:15' },
  { title: 'Descoberta nova vulnerabilidade de segurança - atualize já!', category: 'Segurança', time: '08:45' },
  { title: 'Britney Spears lança novo álbum', category: 'Entretenimento', time: '11:20' },
  { title: 'Previsão do tempo: sol com nuvens dispersas', category: 'Clima', time: '07:00' },
  { title: 'Dólar fecha em alta nesta terça-feira', category: 'Economia', time: '16:30' }
]

interface EmailPreview {
  from: string
  subject: string
  preview: string
}

const EMAILS: EmailPreview[] = [
  { from: 'MSN Member Services', subject: 'Bem-vindo ao MSN Explorer!', preview: 'Obrigado por fazer login no MSN Explorer...' },
  { from: 'Hotmail Team', subject: 'Sua caixa de entrada foi atualizada', preview: 'Novos recursos disponíveis para sua conta...' },
  { from: 'Messenger Alerts', subject: '3 contatos online agora', preview: 'Seus amigos estão esperando para conversar...' }
]

type ViewMode = 'login' | 'home' | 'email' | 'chat' | 'news'

export const MsnExplorer: React.FC = () => {
  const [view, setView] = useState<ViewMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<EmailPreview | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<string[]>([
    '[Sistema] Bem-vindo ao MSN Messenger!',
    '[Sistema] 3 contatos online'
  ])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Aceita qualquer email/senha - o usuário inventa
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setView('home')
    }, 1500)
  }

  const handleGuestLogin = () => {
    setEmail('convidado@msn.com')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setView('home')
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    setChatHistory([...chatHistory, `[Você] ${chatMessage}`])
    setChatMessage('')
    setTimeout(() => {
      const responses = [
        '[Amigo] Oi! Tudo bem?',
        '[Amigo] Que bom te ver online!',
        '[Amigo] Vamos conversar!',
        '[Amigo] 😊'
      ]
      setChatHistory(prev => [...prev, responses[Math.floor(Math.random() * responses.length)]])
    }, 1000)
  }

  if (view === 'login') {
    return (
      <Root>
        <Top>
          <img src={Icon.msn} alt="MSN" />
          <h2>MSN Explorer 8</h2>
        </Top>
        <Welcome>
          <p>Bem-vindo ao MSN Explorer!</p>
          <p>Entre com seu MSN Passport para acessar seu e-mail, chat e notícias personalizadas.</p>
          <Form onSubmit={handleLogin}>
            <label>Endereço Passport:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@hotmail.com"
            />
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
            <Entrar type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no MSN'}
            </Entrar>
          </Form>
          <ExtraLinks>
            <a href="#" onClick={(e) => { e.preventDefault(); handleGuestLogin() }}>Entrar como Convidado</a>
            <span>|</span>
            <a href="#">Criar nova conta</a>
          </ExtraLinks>
        </Welcome>
        <NewsStrip>
          <strong>Manchetes de hoje:</strong>
          <span>• Windows XP Service Pack 2 já disponível</span>
          <span>• Novo sistema de busca do MSN</span>
          <span>• Dica: use atalhos de teclado para ser mais produtivo</span>
        </NewsStrip>
      </Root>
    )
  }

  return (
    <Root>
      <Top>
        <img src={Icon.msn} alt="MSN" />
        <h2>MSN Explorer 8 - Bem-vindo, {email.split('@')[0]}!</h2>
        <LogoutBtn onClick={() => { setView('login'); setPassword('') }}>Sair</LogoutBtn>
      </Top>
      <MainContent>
        <Sidebar>
          <NavBtn $active={view === 'home'} onClick={() => setView('home')}>
            🏠 Página Inicial
          </NavBtn>
          <NavBtn $active={view === 'email'} onClick={() => setView('email')}>
            📧 E-mail ({EMAILS.length})
          </NavBtn>
          <NavBtn $active={view === 'chat'} onClick={() => setView('chat')}>
            💬 Messenger (3 online)
          </NavBtn>
          <NavBtn $active={view === 'news'} onClick={() => setView('news')}>
            📰 Notícias
          </NavBtn>
        </Sidebar>
        <ContentArea>
          {view === 'home' && (
            <HomeView>
              <WelcomeBox>
                <h3>👋 Olá, {email.split('@')[0]}!</h3>
                <p>Bem-vindo ao seu MSN Explorer. Aqui está o resumo do seu dia:</p>
              </WelcomeBox>
              <QuickStats>
                <StatCard>
                  <StatIcon>📧</StatIcon>
                  <StatValue>{EMAILS.length}</StatValue>
                  <StatLabel>Emails novos</StatLabel>
                </StatCard>
                <StatCard>
                  <StatIcon>💬</StatIcon>
                  <StatValue>3</StatValue>
                  <StatLabel>Amigos online</StatLabel>
                </StatCard>
                <StatCard>
                  <StatIcon>📰</StatIcon>
                  <StatValue>{NEWS_ITEMS.length}</StatValue>
                  <StatLabel>Notícias hoje</StatLabel>
                </StatCard>
              </QuickStats>
              <RecentSection>
                <h4>Últimas Notícias</h4>
                {NEWS_ITEMS.slice(0, 3).map((news, i) => (
                  <NewsItemRow key={i}>
                    <NewsTime>{news.time}</NewsTime>
                    <NewsCategory>{news.category}</NewsCategory>
                    <NewsTitle>{news.title}</NewsTitle>
                  </NewsItemRow>
                ))}
              </RecentSection>
            </HomeView>
          )}
          {view === 'email' && (
            <EmailView>
              <EmailToolbar>
                <EmailBtn onClick={() => alert('Funcionalidade de novo email')}>📝 Novo</EmailBtn>
                <EmailBtn onClick={() => alert('Atualizando...')}>🔄 Atualizar</EmailBtn>
                <EmailBtn $danger onClick={() => selectedEmail && alert('Email excluído')}>🗑️ Excluir</EmailBtn>
              </EmailToolbar>
              <EmailList>
                {EMAILS.map((mail, i) => (
                  <EmailRow
                    key={i}
                    $selected={selectedEmail === mail}
                    onClick={() => setSelectedEmail(mail)}
                  >
                    <EmailFrom>{mail.from}</EmailFrom>
                    <EmailSubject>{mail.subject}</EmailSubject>
                    <EmailPreviewText>{mail.preview}</EmailPreviewText>
                  </EmailRow>
                ))}
              </EmailList>
              {selectedEmail && (
                <EmailDetail>
                  <EmailDetailHeader>
                    <strong>De:</strong> {selectedEmail.from}<br />
                    <strong>Assunto:</strong> {selectedEmail.subject}
                  </EmailDetailHeader>
                  <EmailDetailBody>
                    {selectedEmail.preview}<br /><br />
                    Este é um email de demonstração do MSN Explorer. Aqui você veria o conteúdo completo da mensagem.
                  </EmailDetailBody>
                </EmailDetail>
              )}
            </EmailView>
          )}
          {view === 'chat' && (
            <ChatView>
              <ChatSidebar>
                <ChatContact $online>🟢 Amigo 1</ChatContact>
                <ChatContact $online>🟢 Amigo 2</ChatContact>
                <ChatContact $online>🟢 Amigo 3</ChatContact>
                <ChatContact $offline>⚪ Amigo 4</ChatContact>
                <ChatContact $offline>⚪ Amigo 5</ChatContact>
              </ChatSidebar>
              <ChatMain>
                <ChatHistory>
                  {chatHistory.map((msg, i) => (
                    <ChatMessage key={i} $isMe={msg.startsWith('[Você]')}>
                      {msg}
                    </ChatMessage>
                  ))}
                </ChatHistory>
                <ChatInputArea>
                  <ChatInput
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <ChatSendBtn onClick={handleSendMessage}>Enviar</ChatSendBtn>
                </ChatInputArea>
              </ChatMain>
            </ChatView>
          )}
          {view === 'news' && (
            <NewsView>
              <NewsHeader>📰 MSN Notícias - Últimas Atualizações</NewsHeader>
              {NEWS_ITEMS.map((news, i) => (
                <NewsFullItem key={i}>
                  <NewsFullTime>{news.time} - {news.category}</NewsFullTime>
                  <NewsFullTitle>{news.title}</NewsFullTitle>
                  <NewsFullText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                  </NewsFullText>
                </NewsFullItem>
              ))}
            </NewsView>
          )}
        </ContentArea>
      </MainContent>
    </Root>
  )
}

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

const LogoutBtn = styled.button`
  margin-left: auto;
  padding: 4px 12px;
  background: linear-gradient(180deg, #ff9900 0%, #c67300 100%);
  color: #fff;
  border: 1px solid #ffd27c;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
`

const ExtraLinks = styled.div`
  display: flex;
  gap: 8px;
  font-size: 11px;
  a { color: #ffd27c; text-decoration: none; }
  a:hover { text-decoration: underline; }
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`

const Sidebar = styled.div`
  width: 160px;
  background: rgba(0,0,0,0.2);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NavBtn = styled.button<{ $active?: boolean }>`
  padding: 8px 10px;
  background: ${(p) => (p.$active ? 'linear-gradient(180deg, #ff9900 0%, #c67300 100%)' : 'transparent')};
  color: #fff;
  border: none;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  font-size: 12px;
  &:hover { background: ${(p) => (p.$active ? 'linear-gradient(180deg, #ff9900 0%, #c67300 100%)' : 'rgba(255,255,255,0.1)')}; }
`

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
`

const HomeView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const WelcomeBox = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 16px;
  border-radius: 8px;
  h3 { margin: 0 0 8px 0; }
  p { margin: 0; opacity: 0.9; }
`

const QuickStats = styled.div`
  display: flex;
  gap: 12px;
`

const StatCard = styled.div`
  flex: 1;
  background: rgba(255,255,255,0.1);
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`

const StatIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffd27c;
`

const StatLabel = styled.div`
  font-size: 11px;
  opacity: 0.8;
`

const RecentSection = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 12px;
  border-radius: 8px;
  h4 { margin: 0 0 12px 0; }
`

const NewsItemRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 6px 0;
  font-size: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`

const NewsTime = styled.span`
  color: #ffd27c;
  width: 50px;
`

const NewsCategory = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
`

const NewsTitle = styled.span`
  flex: 1;
`

const EmailView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const EmailToolbar = styled.div`
  display: flex;
  gap: 8px;
`

const EmailBtn = styled.button<{ $danger?: boolean }>`
  padding: 6px 12px;
  background: ${(p) => (p.$danger ? 'linear-gradient(180deg, #c00 0%, #800 100%)' : 'linear-gradient(180deg, #008ce4 0%, #0066cc 100%)')};
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
`

const EmailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const EmailRow = styled.div<{ $selected?: boolean }>`
  padding: 10px 12px;
  background: ${(p) => (p.$selected ? 'rgba(255,153,0,0.3)' : 'rgba(255,255,255,0.1)')};
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$selected ? '#ff9900' : 'transparent')};
  &:hover { background: rgba(255,255,255,0.15); }
`

const EmailFrom = styled.div`
  font-weight: bold;
  font-size: 12px;
`

const EmailSubject = styled.div`
  font-size: 13px;
  margin: 4px 0;
`

const EmailPreviewText = styled.div`
  font-size: 11px;
  opacity: 0.7;
`

const EmailDetail = styled.div`
  background: rgba(255,255,255,0.95);
  color: #000;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
`

const EmailDetailHeader = styled.div`
  border-bottom: 1px solid #ddd;
  padding-bottom: 12px;
  margin-bottom: 12px;
  font-size: 12px;
`

const EmailDetailBody = styled.div`
  font-size: 13px;
  line-height: 1.5;
`

const ChatView = styled.div`
  display: flex;
  height: 100%;
  gap: 12px;
`

const ChatSidebar = styled.div`
  width: 140px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ChatContact = styled.div<{ $online?: boolean; $offline?: boolean }>`
  padding: 6px 8px;
  font-size: 12px;
  background: ${(p) => (p.$online ? 'rgba(0,200,0,0.2)' : 'rgba(100,100,100,0.2)')};
  border-radius: 4px;
`

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.95);
  border-radius: 8px;
  overflow: hidden;
`

const ChatHistory = styled.div`
  flex: 1;
  padding: 12px;
  overflow: auto;
  color: #000;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ChatMessage = styled.div<{ $isMe?: boolean }>`
  padding: 6px 10px;
  background: ${(p) => (p.$isMe ? '#e3f2fd' : '#f5f5f5')};
  border-radius: 12px;
  align-self: ${(p) => (p.$isMe ? 'flex-end' : 'flex-start')};
  max-width: 80%;
`

const ChatInputArea = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: #fff;
`

const ChatInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
`

const ChatSendBtn = styled.button`
  padding: 8px 16px;
  background: linear-gradient(180deg, #008ce4 0%, #0066cc 100%);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`

const NewsView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const NewsHeader = styled.h3`
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(255,255,255,0.2);
`

const NewsFullItem = styled.div`
  background: rgba(255,255,255,0.1);
  padding: 12px;
  border-radius: 8px;
`

const NewsFullTime = styled.div`
  font-size: 11px;
  color: #ffd27c;
  margin-bottom: 4px;
`

const NewsFullTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
`

const NewsFullText = styled.p`
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.5;
`

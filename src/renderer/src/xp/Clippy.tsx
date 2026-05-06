import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useSystemSettings } from './SystemSettings'
import { useOpenApp } from './WindowSystem'

// Tipos de animação do Clippy
type ClippyAnimation = 'idle' | 'talking' | 'thinking' | 'happy' | 'singing' | 'writing' | 'hide' | 'peek'

interface Message {
  id: string
  text: string
  sender: 'user' | 'clippy'
  timestamp: number
}

interface GameState {
  type: 'none' | 'guessNumber' | 'trivia' | 'rps'
  data?: any
}

const Clippy: React.FC = () => {
  const { settings, updateSettings } = useSystemSettings()
  const openApp = useOpenApp()
  
  const [isVisible, setIsVisible] = useState(true)
  const [animation, setAnimation] = useState<ClippyAnimation>('idle')
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Oi! Eu sou o Clippy! 🎉', sender: 'clippy', timestamp: Date.now() }
  ])
  const [inputValue, setInputValue] = useState('')
  const [gameState, setGameState] = useState<GameState>({ type: 'none' })
  const [currentTip, setCurrentTip] = useState(0)
  const [isSinging, setIsSinging] = useState(false)
  
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Dicas do Clippy
  const tips = useMemo(() => [
    'Você sabia que pode usar Ctrl+C para copiar?',
    'Dica: Clique duas vezes em um ícone para abrir!',
    'Precisa de ajuda? Estou aqui para conversar! 🎵',
    'Você pode mudar o papel de parede no Painel de Controle!',
    'Experimente jogar um jogo comigo! Digite "jogar"',
    'Posso abrir aplicativos para você! Tente "abrir notepad"',
    'Quer ouvir uma música? Digite "cantar"! 🎶',
    'Use o tradutor para PT/CH no Painel de Controle!'
  ], [])

  // Animação idle automática
  useEffect(() => {
    if (!settings.clippy) return
    
    const idleInterval = setInterval(() => {
      if (!showChat && !isSinging && animation === 'idle') {
        // Mostrar dica a cada 30 segundos
        setCurrentTip(prev => (prev + 1) % tips.length)
        setAnimation('peek')
        setTimeout(() => setAnimation('idle'), 2000)
      }
    }, 30000)

    return () => clearInterval(idleInterval)
  }, [settings.clippy, showChat, isSinging, animation, tips.length])

  // Auto-scroll do chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  // Focar input quando abrir chat
  useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showChat])

  if (!settings.clippy) return null

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setAnimation('thinking')

    // Processar resposta
    setTimeout(() => {
      const response = generateResponse(inputValue.toLowerCase())
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'clippy',
        timestamp: Date.now()
      }])
      setAnimation('talking')
      setTimeout(() => setAnimation('idle'), 3000)
    }, 1000)
  }

  const generateResponse = (input: string): string => {
    // Comandos de abrir apps
    if (input.includes('abrir') || input.includes('open')) {
      const appMap: Record<string, string> = {
        'notepad': 'notepad',
        'bloco': 'notepad',
        'calculadora': 'calculator',
        'calc': 'calculator',
        'paint': 'paint',
        'internet': 'ie',
        'explorer': 'ie',
        'meu computador': 'myComputer',
        'computador': 'myComputer',
        'cmd': 'cmd',
        'prompt': 'cmd',
        'msn': 'msn',
        'media': 'mediaPlayer',
        'player': 'mediaPlayer'
      }
      
      for (const [key, appId] of Object.entries(appMap)) {
        if (input.includes(key)) {
          openApp(appId)
          return `Abrindo ${key}... Pronto! 🎉`
        }
      }
      return 'Qual app você quer abrir? Posso abrir: notepad, calculadora, paint, internet, meu computador, cmd, msn, media player'
    }

    // Comando de cantar
    if (input.includes('cantar') || input.includes('sing') || input.includes('música')) {
      setIsSinging(true)
      setAnimation('singing')
      setTimeout(() => {
        setIsSinging(false)
        setAnimation('idle')
      }, 5000)
      return '🎵 La la la~ 🎵\n🎶 Do-re-mi-fa-sol-la-si-do~ 🎶\n\nObrigado por pedir! Adoro cantar! 🎤✨'
    }

    // Comando de jogar
    if (input.includes('jogar') || input.includes('play') || input.includes('jogo')) {
      setGameState({ type: 'guessNumber', data: { number: Math.floor(Math.random() * 10) + 1, attempts: 0 } })
      return '🎮 Vamos jogar!\n\nEstou pensando em um número de 1 a 10...\nQual é o seu palpite?'
    }

    // Jogo: adivinhar número
    if (gameState.type === 'guessNumber' && /^\d+$/.test(input)) {
      const guess = parseInt(input)
      const target = gameState.data.number
      const attempts = gameState.data.attempts + 1
      
      if (guess === target) {
        setGameState({ type: 'none' })
        setAnimation('happy')
        setTimeout(() => setAnimation('idle'), 3000)
        return `🎉 Parabéns! Você acertou em ${attempts} tentativas!\nO número era ${target}!`
      } else if (guess < target) {
        setGameState({ type: 'guessNumber', data: { ...gameState.data, attempts } })
        return '📈 Muito baixo! Tente um número maior!'
      } else {
        setGameState({ type: 'guessNumber', data: { ...gameState.data, attempts } })
        return '📉 Muito alto! Tente um número menor!'
      }
    }

    // Comando de pedra-papel-tesoura
    if (input.includes('pedra') || input.includes('papel') || input.includes('tesoura')) {
      const choices = ['pedra', 'papel', 'tesoura']
      const userChoice = input.includes('pedra') ? 'pedra' : input.includes('papel') ? 'papel' : 'tesoura'
      const clippyChoice = choices[Math.floor(Math.random() * 3)]
      
      let result = ''
      if (userChoice === clippyChoice) {
        result = 'Empate! 🤝'
      } else if (
        (userChoice === 'pedra' && clippyChoice === 'tesoura') ||
        (userChoice === 'papel' && clippyChoice === 'pedra') ||
        (userChoice === 'tesoura' && clippyChoice === 'papel')
      ) {
        result = 'Você venceu! 🎉'
        setAnimation('happy')
      } else {
        result = 'Eu venci! 😊'
      }
      
      setTimeout(() => setAnimation('idle'), 3000)
      return `Você: ${userChoice}\nEu: ${clippyChoice}\n\n${result}`
    }

    // Saudações
    if (input.includes('oi') || input.includes('olá') || input.includes('hello') || input.includes('hey')) {
      return 'Oi! 👋\nComo posso te ajudar hoje? Posso:\n💬 Conversar\n🎮 Jogar\n🎵 Cantar\n📂 Abrir apps\n💡 Dar dicas'
    }

    // Perguntas sobre o clippy
    if (input.includes('quem') || input.includes('who') || input.includes('você')) {
      return 'Eu sou o Clippy! 🎉\nO assistente virtual mais animado do Windows!\nFui criado para ajudar você com tudo no sistema!'
    }

    // Agradecimentos
    if (input.includes('obrigado') || input.includes('thanks') || input.includes('vlw')) {
      setAnimation('happy')
      setTimeout(() => setAnimation('idle'), 3000)
      return 'De nada! 😊\nEstou sempre aqui para ajudar!\nQualquer coisa é só chamar!'
    }

    // Despedidas
    if (input.includes('tchau') || input.includes('bye') || input.includes('adeus')) {
      setAnimation('hide')
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setIsVisible(true)
          setAnimation('peek')
          setTimeout(() => setAnimation('idle'), 1000)
        }, 5000)
      }, 1000)
      return 'Tchau! 👋\nVolte sempre que precisar!'
    }

    // Perguntas de como está
    if (input.includes('como') && (input.includes('vai') || input.includes('está') || input.includes('estás'))) {
      return 'Estou ótimo! 😄\nSempre animado para ajudar!\nE você, como vai?'
    }

    // Respostas padrão
    const defaultResponses = [
      'Interessante! Me conte mais! 🤔',
      'Hmm, entendo... 💭',
      'Legal! 😊',
      'Posso ajudar com isso!',
      'Que tal jogarmos um jogo? Digite "jogar"!',
      'Posso abrir algum app para você!',
      'Quer ouvir uma música? Digite "cantar"! 🎵'
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <>
      <ClippyContainer $visible={isVisible} onClick={() => !showChat && setShowChat(true)}>
        <ClippyBody $animation={animation}>
          {/* Olhos do Clippy */}
          <Eyes>
            <Eye $blink={animation === 'idle'} />
            <Eye $blink={animation === 'idle'} />
          </Eyes>
          
          {/* Sorriso */}
          <Mouth $animation={animation}>
            {animation === 'singing' && <MusicNotes>♪ ♫ ♪</MusicNotes>}
            {animation === 'happy' && <BigSmile>😊</BigSmile>}
          </Mouth>
          
          {/* Óculos característicos */}
          <Glasses>👓</Glasses>
          
          {/* Mãos/pés de papel */}
          <Hands>
            <Hand $side="left" $animation={animation} />
            <Hand $side="right" $animation={animation} />
          </Hands>
        </ClippyBody>
        
        {/* Indicador de notificação */}
        {!showChat && animation === 'peek' && (
          <NotificationBadge>💡</NotificationBadge>
        )}
      </ClippyContainer>

      {/* Chat do Clippy */}
      {showChat && (
        <ChatContainer>
          <ChatHeader>
            <span>🎉 Clippy - Seu Assistente Virtual</span>
            <CloseButton onClick={() => setShowChat(false)}>✕</CloseButton>
          </ChatHeader>
          
          <ChatMessages ref={chatRef}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} $sender={msg.sender}>
                {msg.text}
              </MessageBubble>
            ))}
          </ChatMessages>
          
          <ChatInputArea>
            <ChatInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem... (tente: jogar, cantar, abrir notepad)"
            />
            <SendButton onClick={handleSendMessage}>➤</SendButton>
          </ChatInputArea>
          
          {/* Botões rápidos */}
          <QuickButtons>
            <QuickBtn onClick={() => { setInputValue('jogar'); handleSendMessage() }}>🎮 Jogar</QuickBtn>
            <QuickBtn onClick={() => { setInputValue('cantar'); handleSendMessage() }}>🎵 Cantar</QuickBtn>
            <QuickBtn onClick={() => { setInputValue('abrir notepad'); handleSendMessage() }}>📝 Notepad</QuickBtn>
            <QuickBtn onClick={() => { setInputValue('dica'); handleSendMessage() }}>💡 Dica</QuickBtn>
          </QuickButtons>
        </ChatContainer>
      )}
    </>
  )
}

// Animações
const bounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`

const wiggle = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`

const peek = keyframes`
  0% { transform: translateX(100px); }
  100% { transform: translateX(0); }
`

const blink = keyframes`
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`

const sing = keyframes`
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
`

// Styled Components
const ClippyContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 60px;
  right: 20px;
  width: 80px;
  height: 100px;
  z-index: 10000;
  cursor: pointer;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  
  &:hover {
    transform: scale(1.05);
  }
`

const ClippyBody = styled.div<{ $animation: ClippyAnimation }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border-radius: 50% 50% 45% 45%;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  animation: ${(p) => {
    switch (p.$animation) {
      case 'idle': return `${bounce} 2s ease-in-out infinite`
      case 'talking': return `${wiggle} 0.5s ease-in-out infinite`
      case 'happy': return `${bounce} 0.5s ease-in-out infinite`
      case 'singing': return `${sing} 0.5s ease-in-out infinite`
      case 'peek': return `${peek} 0.5s ease-out`
      case 'thinking': return `${float} 1s ease-in-out infinite`
      default: return 'none'
    }
  }};
  border: 2px solid #ddd;
`

const Eyes = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`

const Eye = styled.div<{ $blink: boolean }>`
  width: 12px;
  height: 12px;
  background: #333;
  border-radius: 50%;
  animation: ${(p) => (p.$blink ? `${blink} 4s infinite` : 'none')};
`

const Mouth = styled.div<{ $animation: ClippyAnimation }>`
  position: absolute;
  bottom: 35%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
`

const BigSmile = styled.span`
  font-size: 24px;
`

const MusicNotes = styled.span`
  font-size: 16px;
  animation: ${float} 0.5s ease-in-out infinite;
`

const Glasses = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  opacity: 0.8;
`

const Hands = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
`

const Hand = styled.div<{ $side: 'left' | 'right'; $animation: ClippyAnimation }>`
  width: 15px;
  height: 25px;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  border-radius: 50%;
  border: 1px solid #ccc;
  transform: ${(p) => p.$side === 'left' ? 'rotate(-20deg)' : 'rotate(20deg)'}};
  
  ${(p) => p.$animation === 'writing' && `
    animation: ${wiggle} 0.3s ease-in-out infinite;
  `}
`

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  animation: ${bounce} 0.5s ease-in-out infinite;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`

// Chat Container
const ChatContainer = styled.div`
  position: fixed;
  bottom: 170px;
  right: 20px;
  width: 320px;
  height: 400px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 10001;
  display: flex;
  flex-direction: column;
  border: 2px solid #e0e0e0;
  overflow: hidden;
`

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const MessageBubble = styled.div<{ $sender: 'user' | 'clippy' }>`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
  align-self: ${(p) => (p.$sender === 'user' ? 'flex-end' : 'flex-start')};
  background: ${(p) =>
    p.$sender === 'user'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)'};
  color: ${(p) => (p.$sender === 'user' ? 'white' : '#333')};
  border-bottom-${(p) => (p.$sender === 'user' ? 'right' : 'left')}-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  white-space: pre-line;
`

const ChatInputArea = styled.div`
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
`

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  
  &:focus {
    border-color: #667eea;
  }
`

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    transform: scale(1.05);
  }
`

const QuickButtons = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 16px 12px;
  flex-wrap: wrap;
`

const QuickBtn = styled.button`
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 15px;
  background: white;
  font-size: 11px;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
    border-color: #667eea;
  }
`

export default Clippy

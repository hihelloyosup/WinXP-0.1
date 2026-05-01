import React from 'react'
import styled from 'styled-components'

interface SecurityScreenProps {
  onClose: () => void
  onLogoff: () => void
  onControlPanel: () => void
  onTaskManager: () => void
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({
  onClose,
  onLogoff,
  onControlPanel,
  onTaskManager
}) => {
  return (
    <SecurityScreenContainer onKeyDown={(e) => { if (e.key === 'Escape') onClose() }} tabIndex={0}>
      <SecurityScreenBox>
        <SecurityTitle>Segurança do Windows</SecurityTitle>
        <SecurityText>
          Clique na opção que você deseja.
        </SecurityText>
        <SecurityButtons>
          <SecurityButton onClick={onLogoff}>Sair (Logout)</SecurityButton>
          <SecurityButton onClick={onControlPanel}>Painel de Controle</SecurityButton>
          <SecurityButton onClick={onTaskManager}>Gerenciador de Tarefas</SecurityButton>
        </SecurityButtons>
        <SecurityCancelContainer>
          <SecurityCancelButton onClick={onClose}>Cancelar</SecurityCancelButton>
        </SecurityCancelContainer>
      </SecurityScreenBox>
    </SecurityScreenContainer>
  )
}

const SecurityScreenContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: #006699;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999998;
`

const SecurityScreenBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  color: white;
  font-family: 'Tahoma', sans-serif;
`

const SecurityTitle = styled.h1`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
`

const SecurityText = styled.p`
  font-size: 14px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
`

const SecurityButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 220px;
`

const SecurityButton = styled.button`
  padding: 6px 12px;
  background-color: #ECE9D8;
  border: 1px solid #003C74;
  border-radius: 3px;
  color: black;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background-color: #E3E0C8;
  }
  
  &:active {
    background-color: #C8C2B0;
  }
`

const SecurityCancelContainer = styled.div`
  margin-top: 12px;
  width: 220px;
`

const SecurityCancelButton = styled.button`
  width: 100%;
  padding: 6px 12px;
  background-color: #ECE9D8;
  border: 1px solid #003C74;
  border-radius: 3px;
  color: black;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background-color: #E3E0C8;
  }
  
  &:active {
    background-color: #C8C2B0;
  }
`

import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { XpMenuBar, XpMenuItem, XpStatusBar, XpStatusField, XpToolbar, XpToolbarBtn } from '../ui'

interface Folder {
  id: string
  name: string
  icon: string
  unread?: number
}

interface Mail {
  from: string
  subject: string
  folder: string
  date: string
  body: string
  unread?: boolean
}

const FOLDERS: Folder[] = [
  { id: 'inbox', name: 'Caixa de entrada', icon: Icon.outlook16, unread: 3 },
  { id: 'outbox', name: 'Caixa de saída', icon: Icon.mail },
  { id: 'sent', name: 'Itens enviados', icon: Icon.mail },
  { id: 'drafts', name: 'Rascunhos', icon: Icon.edit },
  { id: 'deleted', name: 'Itens excluídos', icon: Icon.recycleSmall16 }
]

const MAILS: Mail[] = [
  {
    from: 'Microsoft', subject: 'Bem-vindo ao Outlook Express 6', folder: 'inbox', date: '24/08/2001 10:00',
    body: 'Obrigado por escolher o Outlook Express. Este e-mail contém informações sobre os novos recursos.',
    unread: true
  },
  {
    from: 'Windows Update', subject: 'Atualizações importantes disponíveis', folder: 'inbox', date: '11/10/2003 09:15',
    body: 'Existem atualizações críticas disponíveis para o seu computador. Visite windowsupdate.microsoft.com.',
    unread: true
  },
  {
    from: 'MSN', subject: 'Novo MSN Messenger 7.0', folder: 'inbox', date: '02/06/2004 16:42',
    body: 'Baixe o novo MSN Messenger com emoticons animados, winks e muito mais.',
    unread: true
  },
  {
    from: 'Camilla', subject: 'Lista de músicas para gravar', folder: 'inbox', date: '22/07/2004 21:05',
    body: 'Oi! Segue a lista de músicas pra gravar no CD: Sandy e Júnior, NSYNC, Britney Spears...'
  },
  {
    from: 'Eu', subject: 'Re: Lista de músicas', folder: 'sent', date: '22/07/2004 21:20',
    body: 'Obrigado, já comecei a gravação. Aviso depois!'
  }
]

export const Outlook: React.FC = () => {
  const [folder, setFolder] = useState('inbox')
  const [selected, setSelected] = useState<Mail | null>(null)
  const mails = MAILS.filter((m) => m.folder === folder)

  return (
    <Root>
      <XpMenuBar>
        {['Arquivo', 'Editar', 'Exibir', 'Ferramentas', 'Mensagem', 'Ajuda'].map((m) => (
          <XpMenuItem key={m}><u>{m[0]}</u>{m.slice(1)}</XpMenuItem>
        ))}
      </XpMenuBar>
      <XpToolbar>
        <XpToolbarBtn><img src={Icon.mail} alt="" />Criar e-mail</XpToolbarBtn>
        <XpToolbarBtn $disabled><img src={Icon.forward} alt="" />Responder</XpToolbarBtn>
        <XpToolbarBtn $disabled><img src={Icon.forward} alt="" />Encaminhar</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.refresh} alt="" />Enviar/receber</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.address16} alt="" />Catálogo</XpToolbarBtn>
      </XpToolbar>
      <Body>
        <FolderList>
          <ListHeader>Pastas</ListHeader>
          {FOLDERS.map((f) => (
            <FolderRow
              key={f.id}
              $active={folder === f.id}
              onClick={() => setFolder(f.id)}
            >
              <img src={f.icon} alt="" />
              <span>{f.name}</span>
              {f.unread && <Badge>{f.unread}</Badge>}
            </FolderRow>
          ))}
        </FolderList>
        <MiddleCol>
          <MailList>
            <MailHeader>
              <div style={{ flex: '0 0 20px' }} />
              <div style={{ flex: 2 }}>De</div>
              <div style={{ flex: 3 }}>Assunto</div>
              <div style={{ flex: 2, textAlign: 'right' }}>Recebido</div>
            </MailHeader>
            {mails.map((m, i) => (
              <MailRow
                key={i}
                $selected={selected === m}
                $unread={!!m.unread}
                onClick={() => setSelected(m)}
              >
                <div style={{ flex: '0 0 20px' }}>✉</div>
                <div style={{ flex: 2 }}>{m.from}</div>
                <div style={{ flex: 3 }}>{m.subject}</div>
                <div style={{ flex: 2, textAlign: 'right' }}>{m.date}</div>
              </MailRow>
            ))}
          </MailList>
          <Preview>
            {selected ? (
              <>
                <PreviewHeader>
                  <div><b>De:</b> {selected.from}</div>
                  <div><b>Data:</b> {selected.date}</div>
                  <div><b>Assunto:</b> {selected.subject}</div>
                </PreviewHeader>
                <PreviewBody>{selected.body}</PreviewBody>
              </>
            ) : (
              <PreviewEmpty>Selecione uma mensagem para visualizar</PreviewEmpty>
            )}
          </Preview>
        </MiddleCol>
      </Body>
      <XpStatusBar>
        <XpStatusField>{mails.length} mensagens nesta pasta</XpStatusField>
        <XpStatusField>Online</XpStatusField>
      </XpStatusBar>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ece9d8;
`

const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`

const FolderList = styled.div`
  width: 180px;
  background: #fff;
  border-right: 1px solid #b3b3b3;
  overflow-y: auto;
`

const ListHeader = styled.div`
  padding: 4px 8px;
  background: #d7d7bb;
  font-weight: bold;
  font-size: 11px;
`

const FolderRow = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: none;
  background: ${(p) => (p.$active ? '#316ac5' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#000')};
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  img { width: 16px; height: 16px; }
  span { flex: 1; }
`

const Badge = styled.span`
  background: #bf3030;
  color: #fff;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 10px;
`

const MiddleCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const MailList = styled.div`
  flex: 1;
  overflow: auto;
  background: #fff;
  border-bottom: 1px solid #b3b3b3;
`

const MailHeader = styled.div`
  display: flex;
  padding: 2px 6px;
  background: linear-gradient(180deg, #fafafa 0%, #ece9d8 100%);
  border-bottom: 1px solid #b3b3b3;
  font-size: 11px;
  font-weight: bold;
  & > div { padding: 0 4px; }
`

const MailRow = styled.div<{ $selected: boolean; $unread: boolean }>`
  display: flex;
  padding: 2px 6px;
  font-size: 11px;
  background: ${(p) => (p.$selected ? '#316ac5' : 'transparent')};
  color: ${(p) => (p.$selected ? '#fff' : '#000')};
  font-weight: ${(p) => (p.$unread ? 'bold' : 'normal')};
  cursor: default;
  & > div { padding: 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &:hover { background: ${(p) => (p.$selected ? '#316ac5' : '#e9e6d0')}; }
`

const Preview = styled.div`
  flex: 1.1;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  background: #fff;
`

const PreviewHeader = styled.div`
  padding: 6px 10px;
  background: #ece9d8;
  border-bottom: 1px solid #b3b3b3;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const PreviewBody = styled.div`
  flex: 1;
  padding: 12px;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow: auto;
`

const PreviewEmpty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-style: italic;
`

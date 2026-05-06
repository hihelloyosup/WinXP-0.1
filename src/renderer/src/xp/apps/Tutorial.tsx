import React, { useState } from 'react'
import styled from 'styled-components'
import { theme } from '../theme'
import { Icon } from '../icons'

type TabType = 'inicio' | 'basico' | 'amador' | 'expert' | 'dicas'

export const Tutorial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('inicio')

  return (
    <TutorialContainer>
      <TabBar>
        <Tab
          active={activeTab === 'inicio'}
          onClick={() => setActiveTab('inicio')}
        >
          Início
        </Tab>
        <Tab
          active={activeTab === 'basico'}
          onClick={() => setActiveTab('basico')}
        >
          Uso Básico
        </Tab>
        <Tab
          active={activeTab === 'amador'}
          onClick={() => setActiveTab('amador')}
        >
          Intermediário
        </Tab>
        <Tab
          active={activeTab === 'expert'}
          onClick={() => setActiveTab('expert')}
        >
          Avançado
        </Tab>
        <Tab
          active={activeTab === 'dicas'}
          onClick={() => setActiveTab('dicas')}
        >
          Dicas & Truques
        </Tab>
      </TabBar>

      <ContentArea>
        {activeTab === 'inicio' && <AbaPrincipal />}
        {activeTab === 'basico' && <AbaUsoBásico />}
        {activeTab === 'amador' && <AbaIntermediário />}
        {activeTab === 'expert' && <AbaAvançado />}
        {activeTab === 'dicas' && <AbaDicas />}
      </ContentArea>
    </TutorialContainer>
  )
}

const AbaPrincipal: React.FC = () => (
  <ScrollContent>
    <Title>Bem-vindo ao Windows XP Emulado</Title>
    <Description>
      Este é um emulador completo do Windows XP com vários aplicativos clássicos. Use este tutorial
      para aprender a navegar e usar todas as funcionalidades disponíveis.
    </Description>

    <SectionTitle>O que você vai aprender:</SectionTitle>
    <List>
      <ListItem>✓ Como usar o desktop e seus componentes básicos</ListItem>
      <ListItem>✓ Como abrir e gerenciar aplicativos</ListItem>
      <ListItem>✓ Como usar os aplicativos disponíveis</ListItem>
      <ListItem>✓ Dicas e truques para melhor experiência</ListItem>
    </List>

    <Note>
      💡 <strong>Dica:</strong> Cada aba do tutorial está focada em um nível diferente de conhecimento.
      Comece pelo "Uso Básico" se for a primeira vez!
    </Note>

    <InfoBox>
      <InfoTitle>Aplicativos Disponíveis:</InfoTitle>
      <AppList>
        <AppItem>Meu Computador - Explore arquivos do sistema</AppItem>
        <AppItem>Notepad - Editor de texto simples</AppItem>
        <AppItem>Calculator - Calculadora científica</AppItem>
        <AppItem>Paint - Editor de imagens</AppItem>
        <AppItem>Internet Explorer - Navegador web</AppItem>
        <AppItem>Minesweeper - Jogo clássico</AppItem>
        <AppItem>E muito mais!</AppItem>
      </AppList>
    </InfoBox>
  </ScrollContent>
)

const AbaUsoBásico: React.FC = () => (
  <ScrollContent>
    <Title>Uso Básico - Iniciante</Title>

    <Section>
      <SectionTitle>1. O Desktop (Área de Trabalho)</SectionTitle>
      <Paragraph>
        O desktop é a tela inicial do Windows XP. Nele você pode ver ícones de aplicativos e um menu
        "Iniciar" no canto inferior esquerdo.
      </Paragraph>
      <CodeBox>
        → Clique duplo em um ícone para abrir um aplicativo
        → Clique com botão direito para ver opções
      </CodeBox>
    </Section>

    <Section>
      <SectionTitle>2. Menu Iniciar</SectionTitle>
      <Paragraph>
        O menu Iniciar (canto inferior esquerdo) é o hub central de navegação. De lá você pode:
      </Paragraph>
      <List>
        <ListItem>Abrir programas</ListItem>
        <ListItem>Acessar documentos recentes</ListItem>
        <ListItem>Acessar configurações</ListItem>
        <ListItem>Desligar o computador</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>3. Barra de Tarefas (Taskbar)</SectionTitle>
      <Paragraph>
        A barra cinza na base da tela mostra os aplicativos abertos. Clique em um ícone para
        alternaar entre janelas abertas.
      </Paragraph>
    </Section>

    <Section>
      <SectionTitle>4. Controlando Janelas</SectionTitle>
      <List>
        <ListItem>Clique no botão X para fechar</ListItem>
        <ListItem>Clique em - para minimizar</ListItem>
        <ListItem>Clique em □ para maximizar/restaurar</ListItem>
        <ListItem>Arraste a barra azul para mover a janela</ListItem>
      </List>
    </Section>

    <Note>
      💡 <strong>Dica:</strong> Pressione Alt+Tab para alternar rapidamente entre janelas abertas!
    </Note>
  </ScrollContent>
)

const AbaIntermediário: React.FC = () => (
  <ScrollContent>
    <Title>Uso Intermediário - Amador</Title>

    <Section>
      <SectionTitle>1. Gerenciador de Arquivos</SectionTitle>
      <Paragraph>
        O "Meu Computador" permite navegar pelos arquivos e pastas do sistema. Você pode:
      </Paragraph>
      <List>
        <ListItem>Explorar drives e diretórios</ListItem>
        <ListItem>Copiar, recortar e colar arquivos (Ctrl+C, Ctrl+X, Ctrl+V)</ListItem>
        <ListItem>Criar novas pastas (Ctrl+Shift+N)</ListItem>
        <ListItem>Renomear arquivos (F2)</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>2. Atalhos de Teclado Essenciais</SectionTitle>
      <CodeBox>
        Ctrl+Z - Desfazer
        Ctrl+Y - Refazer
        Ctrl+A - Selecionar tudo
        Ctrl+S - Salvar
        Ctrl+P - Imprimir
        Ctrl+F - Buscar
      </CodeBox>
    </Section>

    <Section>
      <SectionTitle>3. Usando o Notepad</SectionTitle>
      <Paragraph>
        O Notepad é um editor de texto simples perfeito para criar e editar documentos:
      </Paragraph>
      <List>
        <ListItem>Abra um arquivo existente (Ctrl+O)</ListItem>
        <ListItem>Crie um novo arquivo (Ctrl+N)</ListItem>
        <ListItem>Salve com um novo nome (Ctrl+Shift+S)</ListItem>
        <ListItem>Use Find & Replace (Ctrl+H)</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>4. Múltiplas Janelas</SectionTitle>
      <Paragraph>
        Você pode abrir vários aplicativos simultaneamente. Use:
      </Paragraph>
      <List>
        <ListItem>Alt+Tab para alternar entre janelas</ListItem>
        <ListItem>Clique na Taskbar para ir para uma janela específica</ListItem>
        <ListItem>Arraste as janelas para reorganizá-las na tela</ListItem>
      </List>
    </Section>

    <Note>
      💡 <strong>Dica:</strong> Use Windows+M para minimizar todas as janelas de uma vez!
    </Note>
  </ScrollContent>
)

const AbaAvançado: React.FC = () => (
  <ScrollContent>
    <Title>Uso Avançado - Expert</Title>

    <Section>
      <SectionTitle>1. Prompt de Comando (CMD)</SectionTitle>
      <Paragraph>
        Acesse o sistema via linha de comando para controle total:
      </Paragraph>
      <CodeBox>
dir        - Lista arquivos e pastas
cd         - Muda de diretório
mkdir      - Cria nova pasta
del        - Deleta arquivos
cls        - Limpa a tela
help       - Mostra comandos disponíveis
      </CodeBox>
      <Paragraph>
        Execute comandos diretamente sem interface gráfica.
      </Paragraph>
    </Section>

    <Section>
      <SectionTitle>2. Editor do Registro (Regedit)</SectionTitle>
      <Paragraph>
        Modifique configurações avançadas do sistema:
      </Paragraph>
      <List>
        <ListItem>Navegue pela árvore HKEY_LOCAL_MACHINE e HKEY_CURRENT_USER</ListItem>
        <ListItem>Edite valores de configuração do sistema</ListItem>
        <ListItem>Crie novas chaves para personalizações</ListItem>
        <ListItem>Exporte e importe configurações</ListItem>
      </List>
      <WarningBox>
        ⚠️ <strong>Cuidado:</strong> Alterações incorretas podem danificar o sistema!
      </WarningBox>
    </Section>

    <Section>
      <SectionTitle>3. Gerenciador de Tarefas</SectionTitle>
      <Paragraph>
        Monitore e controle processos do sistema:
      </Paragraph>
      <List>
        <ListItem>Visualize CPU e uso de memória em tempo real</ListItem>
        <ListItem>Finalize aplicativos que não respondem</ListItem>
        <ListItem>Gerencie processos ativos do sistema</ListItem>
        <ListItem>Abra com Ctrl+Shift+Esc</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>4. Central de Segurança</SectionTitle>
      <Paragraph>
        Proteja seu sistema com configurações avançadas:
      </Paragraph>
      <List>
        <ListItem>Ative/Desative o Firewall do Windows</ListItem>
        <ListItem>Configure Atualizações Automáticas</ListItem>
        <ListItem>Verifique status do Antivírus</ListItem>
        <ListItem>Gerencie permissões de aplicativos</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>5. Comandos de Executar (Win+R)</SectionTitle>
      <CodeBox>
notepad    - Abre o Bloco de Notas
calc       - Abre a Calculadora
mspaint    - Abre o Paint
cmd        - Abre o Prompt de Comando
taskmgr    - Abre Gerenciador de Tarefas
control    - Abre Painel de Controle
      </CodeBox>
    </Section>

    <Note>
      💡 <strong>Dica:</strong> Use o Executar (Win+R) para acesso rápido a qualquer aplicativo!
    </Note>
  </ScrollContent>
)

const AbaDicas: React.FC = () => (
  <ScrollContent>
    <Title>Dicas & Truques</Title>

    <Section>
      <SectionTitle>⚡ Atalhos Rápidos Poderosos</SectionTitle>
      <CodeBox>
        Windows + E - Abrir Explorer
        Windows + M - Minimizar tudo
        Windows + U - Acessibilidade
        Windows + D - Mostrar/Ocultar Desktop
        Windows + F - Buscar arquivos
        Alt+F4 - Fechar janela ativa
        F5 - Recarregar
        Shift+Delete - Deletar permanentemente
      </CodeBox>
    </Section>

    <Section>
      <SectionTitle>🎮 Dicas de Produtividade</SectionTitle>
      <List>
        <ListItem>
          💼 <strong>Multitarefa:</strong> Abra vários aplicativos e use Alt+Tab para
          alternar rapidamente.
        </ListItem>
        <ListItem>
          📋 <strong>Copiar e Colar:</strong> Copie código, imagens ou texto entre
          aplicativos facilmente.
        </ListItem>
        <ListItem>
          🔍 <strong>Busca Global:</strong> Use Ctrl+F em qualquer aplicativo para buscar
          texto.
        </ListItem>
        <ListItem>
          📁 <strong>Organização:</strong> Crie pastas no Meu Computador para organizar seus
          arquivos.
        </ListItem>
        <ListItem>
          ⌨️ <strong>Teclado:</strong> Use sempre que possível para maior produtividade.
        </ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>🎨 Personalizando Sua Experiência</SectionTitle>
      <List>
        <ListItem>Clique direito no desktop para mudar o wallpaper</ListItem>
        <ListItem>Customize cores no Control Panel → Appearance</ListItem>
        <ListItem>Organize ícones do desktop manualmente ou automaticamente</ListItem>
        <ListItem>Crie pastas no desktop para acesso rápido</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>🏆 Modo Expert: Mensagens Pop-up</SectionTitle>
      <Paragraph>
        O sistema agora exibe mensagens em pop-ups estilo Windows XP com sons contextuais:
      </Paragraph>
      <List>
        <ListItem>🔴 Erro - Som de alerta (dois beeps baixos)</ListItem>
        <ListItem>🟡 Aviso - Som de aviso (dois beeps médios)</ListItem>
        <ListItem>🟢 Sucesso - Som de sucesso (dois beeps altos)</ListItem>
        <ListItem>ℹ️ Informação - Som simples</ListItem>
      </List>
    </Section>

    <Section>
      <SectionTitle>🎯 Jogos Divertidos</SectionTitle>
      <List>
        <ListItem>Minesweeper - O clássico jogo do campo minado</ListItem>
        <ListItem>Solitaire - Jogo de cartas relaxante</ListItem>
      </List>
      <Paragraph style={{ marginTop: '10px' }}>
        Divirta-se enquanto aprende a usar o sistema!
      </Paragraph>
    </Section>

    <WarningBox>
      ⚠️ <strong>Lembre-se:</strong> Este é um emulador educacional. Aproveite para explorar
      e aprender sobre como era usar o Windows XP!
    </WarningBox>
  </ScrollContent>
)

const TutorialContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #ece9d8;
  font-family: ${theme.fonts.ui};
  font-size: 11px;
`

const TabBar = styled.div`
  display: flex;
  background: #ece9d8;
  border-bottom: 2px solid #0a246a;
  padding: 6px 4px 0 4px;
  gap: 2px;
`

interface TabProps {
  active: boolean
}

const Tab = styled.button<TabProps>`
  padding: 6px 16px;
  background: ${(props) =>
    props.active
      ? '#ece9d8'
      : 'linear-gradient(180deg, #dfdbce 0%, #d5cfc0 100%)'};
  border: 1px solid #0a246a;
  border-radius: 4px 4px 0 0;
  color: #000;
  cursor: pointer;
  font-family: ${theme.fonts.ui};
  font-size: 11px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  border-bottom: ${(props) => (props.active ? '2px solid #ece9d8' : '1px solid #0a246a')};
  margin-bottom: -2px;

  &:hover {
    background: ${(props) =>
      props.active
        ? '#ece9d8'
        : 'linear-gradient(180deg, #e5e1d4 0%, #dbd5ca 100%)'};
  }

  &:active {
    filter: brightness(0.95);
  }
`

const ContentArea = styled.div`
  flex: 1;
  background: #ece9d8;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fff;

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #c0c0c0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #f6f4ec 0%, #c8c2a8 100%);
    border: 1px solid #dfdfdf;
    border-radius: 8px;

    &:hover {
      background: linear-gradient(180deg, #fcfbf6 0%, #d9d4bf 100%);
    }
  }
`

const Title = styled.h1`
  font-size: 16px;
  font-weight: bold;
  color: #0a246a;
  margin: 0 0 12px 0;
  border-bottom: 2px solid #0a246a;
  padding-bottom: 8px;
`

const Description = styled.p`
  font-size: 11px;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.5;
`

const SectionTitle = styled.h2`
  font-size: 12px;
  font-weight: bold;
  color: #003fa0;
  margin: 14px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #c0c0c0;
`

const Section = styled.div`
  margin-bottom: 16px;
`

const Paragraph = styled.p`
  font-size: 11px;
  color: #333;
  margin: 8px 0;
  line-height: 1.5;
`

const List = styled.ul`
  list-style: none;
  padding: 0 0 0 16px;
  margin: 8px 0;
`

const ListItem = styled.li`
  font-size: 11px;
  color: #333;
  margin: 6px 0;
  line-height: 1.4;

  &:before {
    content: '→ ';
    color: #003fa0;
    font-weight: bold;
  }
`

const CodeBox = styled.div`
  background: #f4f2eb;
  border: 1px solid #dfdfdf;
  border-radius: 3px;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #333;
  margin: 8px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
`

const Note = styled.div`
  background: #fffacd;
  border: 1px solid #ffeb8e;
  border-radius: 3px;
  padding: 10px 12px;
  margin: 12px 0;
  font-size: 11px;
  color: #333;
  line-height: 1.5;
`

const WarningBox = styled.div`
  background: #ffe4e1;
  border: 1px solid #ffcccb;
  border-radius: 3px;
  padding: 10px 12px;
  margin: 12px 0;
  font-size: 11px;
  color: #8b0000;
  line-height: 1.5;
`

const InfoBox = styled.div`
  background: #e6f2ff;
  border: 2px solid #0a246a;
  border-radius: 3px;
  padding: 12px;
  margin: 12px 0;
`

const InfoTitle = styled.div`
  font-weight: bold;
  color: #0a246a;
  margin-bottom: 8px;
  font-size: 12px;
`

const AppList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const AppItem = styled.div`
  font-size: 11px;
  color: #333;
  padding: 4px 8px;
  background: #fff;
  border-radius: 2px;
  margin-left: 8px;

  &:before {
    content: '• ';
    color: #003fa0;
    font-weight: bold;
  }
`

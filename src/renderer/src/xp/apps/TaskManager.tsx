import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWindows } from '../WindowSystem'
import { useSystemSettings } from '../SystemSettings'
import { XpButton, XpStatusBar, XpStatusField } from '../ui'

export const TaskManager: React.FC = () => {
  const { instances, close } = useWindows()
  const { settings } = useSystemSettings()

  const [activeTab, setActiveTab] = useState<'apps' | 'performance'>('apps')

  const usedRamMb = useMemo(() => {
    return instances.length * 100
  }, [instances.length])

  const ramPercent = useMemo(() => {
    return Math.min(100, Math.round((usedRamMb / settings.maxRamMb) * 100))
  }, [usedRamMb, settings.maxRamMb])

  const isRamWarning = ramPercent >= 80 && ramPercent < 100
  const isRamCritical = ramPercent >= 100

  return (
    <Root>
      <TabBar>
        <Tab $active={activeTab === 'apps'} onClick={() => setActiveTab('apps')}>
          Aplicativos
        </Tab>
        <Tab $active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>
          Desempenho
        </Tab>
      </TabBar>
      
      {activeTab === 'apps' && (
        <AppList>
          <ListHeader>
            <HeaderCell style={{ width: '60%' }}>Nome</HeaderCell>
            <HeaderCell style={{ width: '20%' }}>Status</HeaderCell>
            <HeaderCell style={{ width: '20%' }}>Uso de Memória</HeaderCell>
          </ListHeader>
          {instances.map((inst) => (
            <AppRow key={inst.id}>
              <AppName>
                <img src={inst.icon} alt="" style={{ width: 16, height: 16, marginRight: 8 }} />
                {inst.title}
              </AppName>
              <AppStatus>Em execução</AppStatus>
              <AppMemory>100 MB</AppMemory>
              <div style={{ marginLeft: 'auto' }}>
                <XpButton onClick={() => close(inst.id)}>
                  Finalizar tarefa
                </XpButton>
              </div>
            </AppRow>
          ))}
        </AppList>
      )}

      {activeTab === 'performance' && (
        <PerformancePanel>
          <Section>
            <h3>Uso de Memória RAM</h3>
            <RamBarContainer>
              <RamBar 
                $percent={ramPercent}
                $warning={isRamWarning}
                $critical={isRamCritical}
              />
              <RamLabel>
                {usedRamMb} MB de {settings.maxRamMb} MB ({ramPercent}%)
              </RamLabel>
            </RamBarContainer>
            <p style={{ marginTop: 16 }}>
              {isRamCritical ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  ⚠️ Memória esgotada! Sistema instável!
                </span>
              ) : isRamWarning ? (
                <span style={{ color: '#ff6600', fontWeight: 'bold' }}>
                  ⚠️ Memória alta! Feche alguns aplicativos.
                </span>
              ) : (
                <span style={{ color: 'green' }}>
                  ✓ Memória em nível seguro.
                </span>
              )}
            </p>
          </Section>
        </PerformancePanel>
      )}

      <XpStatusBar>
        <XpStatusField>Processos: {instances.length}</XpStatusField>
        <XpStatusField>Uso de RAM: {ramPercent}%</XpStatusField>
      </XpStatusBar>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ece9d8;
  font-family: Tahoma, sans-serif;
  font-size: 11px;
`

const TabBar = styled.div`
  display: flex;
  background: #d4d0c8;
  border-bottom: 1px solid #aca899;
  padding: 4px 4px 0 4px;
`

const Tab = styled.div<{ $active: boolean }>`
  padding: 4px 16px;
  margin-right: 2px;
  border: 1px solid #aca899;
  border-bottom: none;
  border-radius: 3px 3px 0 0;
  background: ${p => p.$active ? '#ece9d8' : '#d4d0c8'};
  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${p => p.$active ? '#ece9d8' : '#e4e0d4'};
  }
`

const AppList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #fff;
`

const ListHeader = styled.div`
  display: flex;
  padding: 4px 8px;
  background: #ece9d8;
  border-bottom: 1px solid #aca899;
  font-weight: bold;
`

const HeaderCell = styled.div`
  padding: 2px 4px;
`

const AppRow = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-bottom: 1px solid #eee;

  &:hover {
    background: #316ac5;
    color: white;
  }
`

const AppName = styled.div`
  display: flex;
  align-items: center;
  width: 60%;
`

const AppStatus = styled.div`
  width: 20%;
`

const AppMemory = styled.div`
  width: 20%;
`

const PerformancePanel = styled.div`
  flex: 1;
  padding: 16px;
`

const Section = styled.div`
  margin-bottom: 24px;

  h3 {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: bold;
  }
`

const RamBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const RamBar = styled.div<{ $percent: number; $warning: boolean; $critical: boolean }>`
  height: 24px;
  background: #fff;
  border: 1px solid #808080;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${p => p.$percent}%;
    background: ${p => 
      p.$critical ? '#ff0000' : 
      p.$warning ? '#ff9900' : 
      '#008000'
    };
    transition: width 0.3s, background 0.3s;
  }
`

const RamLabel = styled.div`
  font-size: 12px;
`

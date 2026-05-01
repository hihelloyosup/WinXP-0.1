import React, { useState } from 'react'
import styled from 'styled-components'
import { XpMenuBar, XpMenuItem, XpStatusBar, XpStatusField } from '../ui'

interface Node {
  name: string
  values?: { name: string; type: string; data: string }[]
  children?: Node[]
}

const TREE: Node = {
  name: 'Meu computador',
  children: [
    {
      name: 'HKEY_CLASSES_ROOT',
      children: [{ name: '*', children: [] }, { name: '.bat' }, { name: '.exe' }, { name: '.doc' }]
    },
    {
      name: 'HKEY_CURRENT_USER',
      children: [
        {
          name: 'Software',
          children: [
            {
              name: 'Microsoft',
              children: [
                {
                  name: 'Windows',
                  values: [
                    { name: '(Padrão)', type: 'REG_SZ', data: 'Microsoft Windows XP' },
                    { name: 'ProductName', type: 'REG_SZ', data: 'Microsoft Windows XP' },
                    { name: 'CurrentVersion', type: 'REG_SZ', data: '5.1' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    { name: 'HKEY_LOCAL_MACHINE', children: [{ name: 'SOFTWARE' }, { name: 'SYSTEM' }] },
    { name: 'HKEY_USERS', children: [] },
    { name: 'HKEY_CURRENT_CONFIG', children: [] }
  ]
}

function Tree({ node, depth = 0, onSelect, selected }: { node: Node; depth?: number; onSelect: (n: Node, path: string[]) => void; selected: string }): React.ReactElement {
  const [open, setOpen] = useState(depth < 1)
  return (
    <TreeItem>
      <TreeRow
        $selected={selected === node.name}
        $indent={depth * 14}
        onClick={() => {
          setOpen(!open)
          onSelect(node, [])
        }}
      >
        {node.children && (
          <ExpandMark>
            {open ? '▽' : '▷'}
          </ExpandMark>
        )}
        <span>{node.name}</span>
      </TreeRow>
      {open && node.children && (
        <Children>
          {node.children.map((c) => (
            <Tree key={c.name} node={c} depth={depth + 1} onSelect={onSelect} selected={selected} />
          ))}
        </Children>
      )}
    </TreeItem>
  )
}

export const Regedit: React.FC = () => {
  const [selected, setSelected] = useState<Node>(TREE)

  return (
    <Root>
      <XpMenuBar>
        {['Arquivo', 'Editar', 'Exibir', 'Favoritos', 'Ajuda'].map((m) => (
          <XpMenuItem key={m}><u>{m[0]}</u>{m.slice(1)}</XpMenuItem>
        ))}
      </XpMenuBar>
      <Body>
        <LeftCol>
          <Tree node={TREE} onSelect={setSelected} selected={selected.name} />
        </LeftCol>
        <RightCol>
          <TableHeader>
            <div style={{ flex: 2 }}>Nome</div>
            <div style={{ flex: 1 }}>Tipo</div>
            <div style={{ flex: 3 }}>Dados</div>
          </TableHeader>
          {(selected.values ?? [{ name: '(Padrão)', type: 'REG_SZ', data: '(valor não definido)' }]).map((v, i) => (
            <Row key={i}>
              <div style={{ flex: 2 }}>{v.name}</div>
              <div style={{ flex: 1 }}>{v.type}</div>
              <div style={{ flex: 3 }}>{v.data}</div>
            </Row>
          ))}
        </RightCol>
      </Body>
      <XpStatusBar>
        <XpStatusField>Meu computador\{selected.name}</XpStatusField>
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

const LeftCol = styled.div`
  width: 260px;
  background: #fff;
  border-right: 1px solid #aaa;
  overflow: auto;
  font-size: 11px;
  padding: 4px;
`

const RightCol = styled.div`
  flex: 1;
  background: #fff;
  overflow: auto;
  font-size: 11px;
`

const TableHeader = styled.div`
  display: flex;
  background: linear-gradient(180deg, #fff 0%, #ece9d8 100%);
  border-bottom: 1px solid #999;
  padding: 2px 6px;
  & > div { padding: 0 6px; font-weight: bold; }
`

const Row = styled.div`
  display: flex;
  padding: 2px 6px;
  & > div { padding: 0 6px; }
  &:hover { background: #316ac5; color: #fff; }
`

const TreeItem = styled.div``
const Children = styled.div``

const TreeRow = styled.div<{ $selected: boolean; $indent: number }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 4px 1px ${(p) => p.$indent}px;
  cursor: pointer;
  background: ${(p) => (p.$selected ? '#316ac5' : 'transparent')};
  color: ${(p) => (p.$selected ? '#fff' : '#000')};
  &:hover { background: ${(p) => (p.$selected ? '#316ac5' : '#dce6f4')}; }
`

const ExpandMark = styled.span`
  font-size: 8px;
  width: 10px;
  text-align: center;
`

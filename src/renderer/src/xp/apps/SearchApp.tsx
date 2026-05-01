import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { XpButton, XpField } from '../ui'

const RESULTS = [
  { name: 'Meus documentos', type: 'Pasta', path: 'C:\\Documents and Settings\\Camilla\\', icon: Icon.folder32 },
  { name: 'Bliss.jpg', type: 'Imagem JPEG', path: 'C:\\...\\Minhas imagens', icon: Icon.myPictures32 },
  { name: 'Diário.doc', type: 'Documento do WordPad', path: 'C:\\...\\Meus documentos', icon: Icon.wordPad16 },
  { name: 'Notas.txt', type: 'Documento de texto', path: 'C:\\...\\Meus documentos', icon: Icon.notepad16 }
]

export const SearchApp: React.FC = () => {
  const [query, setQuery] = useState('')
  const filtered = query
    ? RESULTS.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : []
  return (
    <Root>
      <Aside>
        <img src={Icon.search32} alt="" />
        <h3>O que deseja pesquisar?</h3>
        <OptBtn>Imagens, músicas ou vídeos</OptBtn>
        <OptBtn>Todos os arquivos e pastas</OptBtn>
        <OptBtn>Computadores ou pessoas</OptBtn>
        <OptBtn>Informações no Centro de Ajuda</OptBtn>
        <Dog>🐶 Ruffles, o cão assistente</Dog>
      </Aside>
      <Main>
        <SearchRow>
          <label>Nome do arquivo:</label>
          <XpField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite algo…"
          />
          <XpButton onClick={() => setQuery(query)}>Pesquisar</XpButton>
        </SearchRow>
        <ResultsList>
          {query && filtered.length === 0 && (
            <Empty>Nenhum resultado encontrado para "{query}".</Empty>
          )}
          {filtered.map((r, i) => (
            <ResultRow key={i}>
              <img src={r.icon} alt="" />
              <div>
                <strong>{r.name}</strong>
                <small>{r.type} — {r.path}</small>
              </div>
            </ResultRow>
          ))}
          {!query && <Empty>Digite um termo acima para começar.</Empty>}
        </ResultsList>
      </Main>
    </Root>
  )
}

const Root = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #ece9d8;
`

const Aside = styled.aside`
  width: 220px;
  background: linear-gradient(180deg, #7ba0ea 0%, #4b77ce 100%);
  padding: 10px;
  color: #fff;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  img { width: 48px; height: 48px; align-self: center; }
  h3 { margin: 4px 0; font-size: 13px; text-align: center; }
`

const OptBtn = styled.button`
  background: rgba(255,255,255,0.85);
  color: #0a246a;
  padding: 5px 8px;
  border: 1px solid rgba(255,255,255,0.7);
  border-radius: 3px;
  text-align: left;
  font-size: 11px;
  cursor: pointer;
  &:hover { background: #fff; }
`

const Dog = styled.div`
  margin-top: auto;
  text-align: center;
  font-size: 12px;
  background: rgba(0,0,0,0.15);
  padding: 6px;
  border-radius: 4px;
`

const Main = styled.div`
  flex: 1;
  background: #fff;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  input { flex: 1; }
`

const ResultsList = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 4px;
  overflow: auto;
`

const Empty = styled.div`
  padding: 30px 10px;
  color: #888;
  text-align: center;
  font-style: italic;
`

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-bottom: 1px dotted #ccc;
  img { width: 32px; height: 32px; image-rendering: pixelated; }
  strong { display: block; font-size: 12px; color: #003fa0; }
  small { color: #555; font-size: 10px; }
  &:hover { background: #f0f4ff; }
`

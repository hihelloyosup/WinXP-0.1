import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
    font-size: 11px;
    color: #000;
    user-select: none;
    -webkit-user-select: none;
  }
  button { font-family: inherit; font-size: inherit; }
  img { image-rendering: pixelated; }
  input, textarea { font-family: inherit; }
  ::selection { background: #316ac5; color: #fff; }
`

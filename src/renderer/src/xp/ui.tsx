import styled, { css } from 'styled-components'
import { theme } from './theme'

export const XpButton = styled.button`
  min-width: 75px;
  padding: 3px 10px;
  background: linear-gradient(180deg, #f6f4ec 0%, #ece9d8 45%, #c8c2a8 100%);
  border: 1px solid #003c74;
  border-radius: 3px;
  font-family: ${theme.fonts.ui};
  font-size: 11px;
  cursor: pointer;
  color: #000;
  box-shadow: inset 0 1px 0 #fff, inset 0 -1px 0 #8c846c;
  &:hover { background: linear-gradient(180deg, #fcfbf6 0%, #eae7d6 45%, #c2bda3 100%); }
  &:active {
    background: linear-gradient(0deg, #f6f4ec 0%, #d9d4bf 100%);
    box-shadow: inset 1px 1px 1px rgba(0,0,0,0.25);
  }
  &:disabled { color: #888; cursor: default; }
`

export const XpField = styled.input`
  padding: 2px 4px;
  border: 1px solid #7f9db9;
  background: #fff;
  font-family: ${theme.fonts.body};
  font-size: 11px;
`

export const XpMenuBar = styled.div`
  display: flex;
  background: linear-gradient(180deg, #ffffff 0%, #ece9d8 100%);
  border-bottom: 1px solid #ccc;
  padding: 0 4px;
  height: 22px;
  align-items: center;
  font-size: 11px;
  gap: 2px;
`

export const XpMenuItem = styled.button`
  padding: 2px 7px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 11px;
  &:hover { background: ${theme.colors.selection}; color: #fff; }
  u { text-decoration: underline; }
`

export const XpToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  background: linear-gradient(180deg, #fafafa 0%, #ece9d8 100%);
  border-bottom: 1px solid #b3b3b3;
`

export const XpToolbarBtn = styled.button<{ $disabled?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border: 1px solid transparent;
  background: transparent;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  color: ${(p) => (p.$disabled ? '#888' : '#000')};
  font-size: 11px;
  border-radius: 2px;
  img { width: 22px; height: 22px; }
  &:hover {
    ${(p) =>
      !p.$disabled &&
      css`
        background: #fffcd8;
        border: 1px solid #ccb979;
      `}
  }
  ${(p) =>
    p.$active &&
    css`
      background: #fbe5b1;
      border: 1px solid #cc8a00;
    `}
`

export const XpStatusBar = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 6px;
  background: #ece9d8;
  border-top: 1px solid #fff;
  box-shadow: inset 0 1px 0 #b3b3b3;
  font-size: 11px;
  height: 18px;
`

export const XpStatusField = styled.div`
  padding: 0 6px;
  border-left: 1px solid #b3b3b3;
  box-shadow: -1px 0 0 #fff;
  &:first-child { border-left: none; box-shadow: none; }
  flex: 1;
`

export const XpGroup = styled.fieldset`
  border: 1px solid #d4d0c8;
  border-radius: 3px;
  padding: 6px 8px;
  margin: 4px 0;
  legend {
    padding: 0 4px;
    font-size: 11px;
    color: #0046d5;
  }
`

export const XpTabs = styled.div`
  display: flex;
  padding: 2px 6px 0 6px;
`

export const XpTab = styled.button<{ $active?: boolean }>`
  padding: 3px 12px 4px;
  background: ${(p) => (p.$active ? '#fff' : '#ece9d8')};
  border: 1px solid #999;
  border-bottom: ${(p) => (p.$active ? '1px solid #fff' : '1px solid #999')};
  border-radius: 3px 3px 0 0;
  margin-right: -1px;
  cursor: pointer;
  font-size: 11px;
  position: relative;
  top: ${(p) => (p.$active ? '0' : '2px')};
  z-index: ${(p) => (p.$active ? 2 : 1)};
`

export const XpAddressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  background: ${theme.colors.windowBg};
  border-bottom: 1px solid #b3b3b3;
  font-size: 11px;
  span.label { color: #666; }
  input {
    flex: 1;
    padding: 2px 4px;
    border: 1px solid #7f9db9;
    background: #fff;
    font-family: ${theme.fonts.body};
    font-size: 11px;
  }
`

export const XpSidePanel = styled.div`
  width: 180px;
  background: ${theme.gradients.sidePanel};
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  color: #fff;
  font-size: 11px;
`

export const XpSidePanelSection = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #d4e4ff 100%);
  border-radius: 4px;
  padding: 6px 8px;
  color: #0a246a;
  header {
    font-weight: bold;
    color: #0a246a;
    background: linear-gradient(180deg, #f0f6ff 0%, #cde0f8 100%);
    margin: -6px -8px 4px;
    padding: 3px 8px;
    border-radius: 4px 4px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ul { list-style: none; padding: 0; margin: 0; }
  li {
    padding: 2px 0;
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`

export const theme = {
  colors: {
    bliss: '#245edc',
    xpBlue: '#0058ee',
    xpBlueLight: '#3a93ff',
    xpBlueDark: '#0c3f9b',
    titleLeft: '#0058ee',
    titleRight: '#3a93ff',
    titleInactiveLeft: '#6f7d9c',
    titleInactiveRight: '#a3b1d1',
    taskbarTop: '#245edc',
    taskbarMid: '#3b86f1',
    taskbarBot: '#245edc',
    startGreenTop: '#3c873c',
    startGreenMid: '#5eac56',
    startGreenBot: '#2f7024',
    buttonFace: '#ece9d8',
    windowBg: '#ece9d8',
    menuBar: '#ffffff',
    menuHover: '#3a93ff',
    selection: '#316ac5',
    text: '#000000',
    textLight: '#ffffff',
    xpBorder: '#0831d9',
    grayTop: '#eeede5',
    grayBot: '#a39f80'
  },
  gradients: {
    titleActive:
      'linear-gradient(180deg, #0058ee 0%, #1264e4 10%, #3a93ff 40%, #0058ee 80%, #0053cf 100%)',
    titleInactive:
      'linear-gradient(180deg, #7a89ad 0%, #8599be 40%, #a3b1d1 85%, #7a89ad 100%)',
    taskbar:
      'linear-gradient(180deg, #245edc 0%, #3572e0 3%, #3a76e2 6%, #2462dd 10%, #1a4fd6 14%, #3072e2 55%, #3072e2 70%, #2054c8 85%, #1e51c5 100%)',
    startButton:
      'linear-gradient(180deg, #3c873c 0%, #55a04a 10%, #77bf6a 40%, #55a04a 65%, #2f7024 100%)',
    startButtonHover:
      'linear-gradient(180deg, #4d9a4d 0%, #6eb965 10%, #92d585 40%, #6eb965 65%, #3c873c 100%)',
    windowBg: 'linear-gradient(180deg, #ece9d8 0%, #dcd8c0 100%)',
    sidePanel:
      'linear-gradient(180deg, #7ba0ea 0%, #4b77ce 40%, #4b77ce 55%, #7ba0ea 100%)',
    startMenuLeft:
      'linear-gradient(180deg, #1967e6 0%, #3485f0 40%, #3485f0 55%, #1967e6 100%)',
    startMenuRight:
      'linear-gradient(180deg, #d3e5f6 0%, #b7cbe4 100%)'
  },
  fonts: {
    ui: "'Trebuchet MS', Tahoma, Arial, sans-serif",
    body: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
    mono: "'Lucida Console', 'Courier New', monospace"
  }
} as const

export type XpTheme = typeof theme

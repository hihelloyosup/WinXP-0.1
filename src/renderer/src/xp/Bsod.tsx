import React, { useEffect } from 'react'
import styled from 'styled-components'

interface BsodProps {
  onRestart?: () => void
}

export const Bsod: React.FC<BsodProps> = ({ onRestart }) => {
  useEffect(() => {
    const handleKeyDown = () => {
      if (onRestart) onRestart()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onRestart])

  return (
    <BsodContainer>
      <BsodText>
        A problem has been detected and Windows has been shut down to prevent damage
        to your computer.
        <br />
        <br />
        The problem seems to be caused by the following file: SYSTEM32
        <br />
        <br />
        CRITICAL_PROCESS_DIED
        <br />
        <br />
        If this is the first time you've seen this stop error screen,
        restart your computer. If this screen appears again, follow
        these steps:
        <br />
        <br />
        Check to make sure any new hardware or software is properly installed.
        If this is a new installation, ask your hardware or software manufacturer
        for any Windows updates you might need.
        <br />
        <br />
        If problems continue, disable or remove any newly installed hardware
        or software. Disable BIOS memory options such as caching or shadowing.
        If you need to use Safe Mode to remove or disable components, restart
        your computer, press F8 to select Advanced Startup Options, and then
        select Safe Mode.
        <br />
        <br />
        Technical Information:
        <br />
        <br />
        *** STOP: 0x000000EF (0x0000000000000000, 0x0000000000000000, 0x0000000000000000, 0x0000000000000000)
        <br />
        <br />
        <br />
        Press any key to restart.
      </BsodText>
    </BsodContainer>
  )
}

const BsodContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: #0000AA;
  color: #FFFFFF;
  font-family: 'Consolas', 'Lucida Console', monospace;
  font-size: 16px;
  padding: 40px;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const BsodText = styled.div`
  max-width: 800px;
  line-height: 1.5;
  white-space: pre-wrap;
`

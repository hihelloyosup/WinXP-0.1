import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { XpMenuBar, XpMenuItem, XpStatusBar, XpStatusField } from '../ui'

type Tool = 'pencil' | 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse' | 'bucket'

const PALETTE = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200',
  '#22b14c', '#00a2e8', '#3f48cc', '#a349a4', '#ffffff', '#c3c3c3',
  '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea',
  '#7092be', '#c8bfe7'
]

export const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<Tool>('brush')
  const [color, setColor] = useState('#000000')
  const [color2, setColor2] = useState('#ffffff')
  const [size, setSize] = useState(2)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, c.width, c.height)
  }, [])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: Math.floor(e.clientX - r.left), y: Math.floor(e.clientY - r.top) }
  }

  const fillFlood = (ctx: CanvasRenderingContext2D, x: number, y: number, fill: string): void => {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const img = ctx.getImageData(0, 0, w, h)
    const d = img.data
    const start = (y * w + x) * 4
    const target = [d[start], d[start + 1], d[start + 2], d[start + 3]]
    const hex = fill.replace('#', '')
    const fr = parseInt(hex.substring(0, 2), 16)
    const fg = parseInt(hex.substring(2, 4), 16)
    const fb = parseInt(hex.substring(4, 6), 16)
    if (fr === target[0] && fg === target[1] && fb === target[2]) return
    const stack = [[x, y]]
    while (stack.length) {
      const [sx, sy] = stack.pop()!
      if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue
      const i = (sy * w + sx) * 4
      if (d[i] !== target[0] || d[i + 1] !== target[1] || d[i + 2] !== target[2]) continue
      d[i] = fr; d[i + 1] = fg; d[i + 2] = fb; d[i + 3] = 255
      stack.push([sx + 1, sy], [sx - 1, sy], [sx, sy + 1], [sx, sy - 1])
    }
    ctx.putImageData(img, 0, 0)
  }

  const onDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const ctx = canvasRef.current!.getContext('2d')!
      drawing.current = true
      const p = getPos(e)
      last.current = p
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = size
      ctx.lineCap = 'round'
      if (tool === 'bucket') {
        fillFlood(ctx, p.x, p.y, color)
        drawing.current = false
      } else if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
        ctx.strokeStyle = tool === 'eraser' ? color2 : color
        ctx.lineWidth = tool === 'eraser' ? size * 4 : tool === 'pencil' ? 1 : size
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + 0.5, p.y + 0.5)
        ctx.stroke()
      }
    },
    [tool, color, color2, size]
  )

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return
      const ctx = canvasRef.current!.getContext('2d')!
      const p = getPos(e)
      if (!last.current) {
        last.current = p
        return
      }
      if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
        ctx.beginPath()
        ctx.moveTo(last.current.x, last.current.y)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
        last.current = p
      }
    },
    [tool]
  )

  const onUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return
      const ctx = canvasRef.current!.getContext('2d')!
      const p = getPos(e)
      const start = last.current!
      if (tool === 'line') {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      } else if (tool === 'rect') {
        ctx.strokeRect(start.x, start.y, p.x - start.x, p.y - start.y)
      } else if (tool === 'ellipse') {
        const cx = (start.x + p.x) / 2
        const cy = (start.y + p.y) / 2
        ctx.beginPath()
        ctx.ellipse(cx, cy, Math.abs(p.x - start.x) / 2, Math.abs(p.y - start.y) / 2, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      drawing.current = false
      last.current = null
    },
    [tool]
  )

  const clear = (): void => {
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    ctx.fillStyle = color2
    ctx.fillRect(0, 0, c.width, c.height)
  }

  const saveAs = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || !window.api) return
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const base64 = dataUrl.split(',')[1]
      const buffer = Buffer.from(base64, 'base64')
      
      const projectPath = await window.api.getProjectPath()
      const defaultName = `untitled.png`
      
      const result = await window.api.showSaveDialog({
        defaultPath: `${projectPath}\\${defaultName}`,
        filters: [
          { name: 'PNG', extensions: ['png'] },
          { name: 'JPEG', extensions: ['jpg', 'jpeg'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      
      if (result && !result.canceled && result.filePath) {
        await window.api.writeFile(result.filePath, buffer)
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <Root>
      <XpMenuBar>
        <XpMenuItem>
          <u>A</u>rquivo
          <div style={{ position: 'absolute', background: '#fff', border: '1px solid #999', boxShadow: '2px 2px 4px rgba(0,0,0,0.2)', minWidth: '150px', marginTop: '2px', display: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.display = 'block' }} onMouseLeave={(e) => { e.currentTarget.style.display = 'none' }}>
            <div style={{ padding: '4px 12px', cursor: 'default' }} onClick={saveAs}>Salvar como...</div>
          </div>
        </XpMenuItem>
        <XpMenuItem><u>E</u>ditar</XpMenuItem>
        <XpMenuItem><u>E</u>xibir</XpMenuItem>
        <XpMenuItem onClick={clear}><u>I</u>magem</XpMenuItem>
        <XpMenuItem>C<u>o</u>res</XpMenuItem>
      </XpMenuBar>
      <Workspace>
        <Tools>
          {[
            { t: 'pencil', l: '✏' },
            { t: 'brush', l: '🖌' },
            { t: 'eraser', l: '⌫' },
            { t: 'bucket', l: '🪣' },
            { t: 'line', l: '／' },
            { t: 'rect', l: '▭' },
            { t: 'ellipse', l: '⬭' }
          ].map((x) => (
            <ToolBtn
              key={x.t}
              $active={tool === x.t}
              onClick={() => setTool(x.t as Tool)}
            >
              {x.l}
            </ToolBtn>
          ))}
          <SizeRow>
            {[1, 2, 4, 8].map((s) => (
              <SizeBtn key={s} $active={size === s} onClick={() => setSize(s)}>
                <Dot $size={s} />
              </SizeBtn>
            ))}
          </SizeRow>
        </Tools>
        <CanvasArea>
          <Canvas
            ref={canvasRef}
            width={640}
            height={420}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
          />
        </CanvasArea>
      </Workspace>
      <PaletteBar>
        <ColorPreview>
          <Rear style={{ background: color2 }} />
          <Front style={{ background: color }} />
        </ColorPreview>
        <Palette>
          {PALETTE.map((c) => (
            <Swatch
              key={c}
              style={{ background: c }}
              onClick={() => setColor(c)}
              onContextMenu={(e) => {
                e.preventDefault()
                setColor2(c)
              }}
            />
          ))}
        </Palette>
      </PaletteBar>
      <XpStatusBar>
        <XpStatusField>Ferramenta: {tool}</XpStatusField>
        <XpStatusField>Cor primária: {color}</XpStatusField>
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

const Workspace = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`

const Tools = styled.div`
  width: 52px;
  padding: 4px;
  background: #ece9d8;
  border-right: 1px solid #a39f80;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  align-content: start;
`

const ToolBtn = styled.button<{ $active: boolean }>`
  width: 22px;
  height: 22px;
  border: 1px solid ${(p) => (p.$active ? '#003c74' : '#aaa')};
  background: ${(p) => (p.$active ? '#fff' : '#ece9d8')};
  box-shadow: ${(p) => (p.$active ? 'inset 1px 1px 1px rgba(0,0,0,0.3)' : 'inset 0 1px 0 #fff')};
  cursor: pointer;
  font-size: 12px;
  padding: 0;
`

const SizeRow = styled.div`
  grid-column: 1 / 3;
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 4px;
  border-top: 1px solid #b3b3b3;
  padding-top: 4px;
`

const SizeBtn = styled.button<{ $active: boolean }>`
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(p) => (p.$active ? '#003c74' : '#aaa')};
  background: #fff;
  cursor: pointer;
  padding: 0;
`

const Dot = styled.span<{ $size: number }>`
  display: block;
  width: ${(p) => Math.min(p.$size * 2, 10)}px;
  height: ${(p) => Math.min(p.$size * 2, 10)}px;
  background: #000;
  border-radius: 50%;
`

const CanvasArea = styled.div`
  flex: 1;
  padding: 6px;
  overflow: auto;
  background: #808080;
`

const Canvas = styled.canvas`
  background: #fff;
  image-rendering: pixelated;
  cursor: crosshair;
  box-shadow: 1px 1px 0 #fff, 2px 2px 4px rgba(0,0,0,0.5);
`

const PaletteBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  background: #ece9d8;
  border-top: 1px solid #a39f80;
`

const ColorPreview = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
`

const Front = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 18px;
  height: 18px;
  border: 1px solid #000;
  z-index: 2;
`

const Rear = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  border: 1px solid #000;
`

const Palette = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 16px);
  grid-template-rows: repeat(2, 16px);
  gap: 1px;
`

const Swatch = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid #000;
  cursor: pointer;
`

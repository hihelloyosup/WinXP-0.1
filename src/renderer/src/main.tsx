import { createRoot } from 'react-dom/client'
import App from './App'
import { MSDos } from './xp/MSDos'

if (window.location.hash === '#msdos') {
  createRoot(document.getElementById('root')!).render(<MSDos />)
} else {
  createRoot(document.getElementById('root')!).render(<App />)
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@solana/wallet-adapter-react-ui/styles.css'
import './index.css'
import App from './App.tsx'
import { Buffer } from 'buffer'
Buffer.from('anything', 'base64')
globalThis.Buffer = Buffer

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <App />,
   </StrictMode>,
)

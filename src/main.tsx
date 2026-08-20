import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import './styles/pages.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root container #root not found')

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
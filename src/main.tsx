import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/ibm-plex-mono/latin-400.css'
import App from './App'
import './styles.css'

const revealHeroFont = () => {
  const root = document.documentElement

  if (!document.fonts) {
    root.classList.remove('hero-font-loading')
    return
  }

  document.fonts
    .load('400 1em "Anton"', 'UNCENSORED')
    .catch(() => undefined)
    .finally(() => root.classList.remove('hero-font-loading'))
}

void revealHeroFont()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)

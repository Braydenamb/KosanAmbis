import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AtmosphereProvider } from './context/AtmosphereContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AtmosphereProvider>
        <App />
      </AtmosphereProvider>
    </ErrorBoundary>
  </StrictMode>,
)

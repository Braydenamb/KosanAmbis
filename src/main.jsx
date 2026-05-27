import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AtmosphereProvider } from './context/AtmosphereContext'
import { NotificationProvider } from './context/NotificationContext'
import { AutomationProvider } from './context/AutomationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AtmosphereProvider>
        <NotificationProvider>
          <AutomationProvider>
            <App />
          </AutomationProvider>
        </NotificationProvider>
      </AtmosphereProvider>
    </ErrorBoundary>
  </StrictMode>,
)

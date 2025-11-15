import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ModalProvider } from './contexts/ModalContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx'

const isAdmin = window.location.hostname === 'admin.localhost'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {isAdmin ? <AdminApp /> : <App />}
    </BrowserRouter>
  </StrictMode>,
)

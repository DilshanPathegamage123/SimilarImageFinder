import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home/Home'
import './index.css'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <Home />
  </StrictMode>,
)

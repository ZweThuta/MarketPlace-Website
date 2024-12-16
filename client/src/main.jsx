import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ItemContextProvider from './util/itemContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ItemContextProvider>
    <App />
    </ItemContextProvider>
  </StrictMode>,
)

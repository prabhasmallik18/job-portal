import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key from .env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// 🔇 Suppress Clerk development key warning in dev mode
if (import.meta.env.DEV && window) {
  const originalWarn = console.warn
  console.warn = function(...args) {
    if (args[0]?.includes?.('Clerk has been loaded with development keys')) {
      return // Suppress this specific warning
    }
    originalWarn.apply(console, args)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      sdkMetadata={{
        name: import.meta.env.DEV ? "@clerk/clerk-react-dev" : "@clerk/clerk-react"
      }}
    >
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)
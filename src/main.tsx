import './polyfill';
import '@mcp-b/global';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './hooks/useTheme'
import { Toaster } from 'sonner'

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" theme="dark" richColors />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)

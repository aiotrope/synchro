import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { config } from './utils/config/index'
import { CommonProvider } from './contexts/Common'
import App from './App'
import './utils/scss/_index.scss'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CommonProvider>
        <GoogleOAuthProvider clientId={config.google_client_id}>
          <Router>
            <App />
          </Router>
        </GoogleOAuthProvider>
      </CommonProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

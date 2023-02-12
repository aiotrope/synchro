import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { FacebookProvider } from 'react-facebook'

import { config } from './utils/config'
import { CommonProvider } from './contexts/Common'
import App from './App'
import './utils/scss/_index.scss'

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CommonProvider>
        <FacebookProvider appId={config.facebook_client_id}>
          <Router>
            <App />
          </Router>
        </FacebookProvider>
      </CommonProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

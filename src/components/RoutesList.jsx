import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { authService } from '../services/auth'
import { Main } from './Main'
import { Login } from './Login'
import { Me } from './Me'
import { NotFound } from './404'

export const RoutesList = () => {
  const authTokens = authService.getAuthTokens()
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route
        path="/login"
        element={!authTokens ? <Login /> : <Navigate to={'/'} />}
      />
      <Route
        path="/me"
        element={authTokens ? <Me /> : <Navigate to={'/login'} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

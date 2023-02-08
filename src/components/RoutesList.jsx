import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { authService } from '../services/auth'
import { Main } from './Main'
import { Login } from './Login'
import { Signup } from './Signup'
import { Me } from './Me'
import { NotFound } from './404'
import { SocialCredentialsGoogle } from './SocialCredentialsGoogle'
import { SocialCredentialsFacebook } from './SocialCredentialsFacebook'
import { ActivateUser } from './ActivateUser'
import { SignupActivation } from './SignupActivation'

export const RoutesList = () => {
  const authTokens = authService.getAuthTokens()
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/login"
        element={!authTokens ? <Login /> : <Navigate to={'/'} />}
      />
      <Route
        path="/me"
        element={authTokens ? <Me /> : <Navigate to={'/login'} />}
      />
      <Route
        path="/api/social-credentials/google"
        element={<SocialCredentialsGoogle />}
      />
      <Route
        path="/api/social-credentials/facebook"
        element={<SocialCredentialsFacebook />}
      />
      <Route path="/signup-activation" element={<SignupActivation />} />
      <Route
        path="/auth/users/activate/:uid/:token"
        element={<ActivateUser />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

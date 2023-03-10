import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ContentfulProvider } from 'react-contentful'

import { contentfulClient } from '../services/contentful'

import tokenService from '../services/token'
import { Home } from './Home'
import { Login } from './Login'
import { Signup } from './Signup'
import { Me } from './Me'
import { NotFound } from './404'
import { SocialCredentialsGoogle } from './SocialCredentialsGoogle'
import { SocialCredentialsFacebook } from './SocialCredentialsFacebook'
import { ActivateUser } from './ActivateUser'
import { SignupActivation } from './SignupActivation'
import { PrivacyPolicy } from './PrivacyPolicy'
import { PasswordResetForm } from './PasswordResetForm'
import { PasswordResetSubmission } from './PasswordResetSubmission'
import { PasswordResetConfirm } from './PasswordResetConfirm'
import { UsernameResetForm } from './UsernameResetForm'
import { UsernameResetSubmission } from './UsernameResetSubmission'
import { UsernameResetConfirm } from './UsernameResetConfirm'
import { ContactForm } from './ContactForm'
import { ContactFormSubmitted } from './ContactFormSubmitted'
import { Shop } from './Shop'
import { Item } from './Item'
import { UserItems } from './UserItems'
import { Cart } from './Cart'
import { PurchaseSubmitted } from './PurchaseSubmitted'
import { Guide } from './Docs'
import { AnonUsersMngtPage } from './AnonymousUsers'
import { ResendUserActivationForm } from './ResendUserActivationForm'
import { ResendUserActivationSubmission } from './ResendUserActivationSubmission'

export const RoutesList = () => {
  const authTokens = tokenService.getAuthTokens()
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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
        path="/api/social/facebook"
        element={<SocialCredentialsFacebook />}
      />

      <Route path="/signup-activation" element={<SignupActivation />} />

      <Route path="/auth/users/activate" element={<ActivateUser />} />

      <Route path="/password-reset-form" element={<PasswordResetForm />} />

      <Route
        path="/password-reset-submission"
        element={<PasswordResetSubmission />}
      />

      <Route
        path="/auth/password/reset/confirm/:uid/:token"
        element={<PasswordResetConfirm />}
      />

      <Route path="/username-reset-form" element={<UsernameResetForm />} />

      <Route
        path="/username-reset-submission"
        element={<UsernameResetSubmission />}
      />

      <Route
        path="/auth/username/reset/confirm/:uid/:token"
        element={<UsernameResetConfirm />}
      />

      <Route
        path="/contact"
        element={authTokens ? <ContactForm /> : <Navigate to={'/login'} />}
      />

      <Route
        path="/contact-form-submitted"
        element={
          authTokens ? <ContactFormSubmitted /> : <Navigate to={'/login'} />
        }
      />

      <Route path="/shop" element={<Shop />} />

      <Route path="/item/:id" element={<Item />} />

      <Route
        path="/user-items"
        element={authTokens ? <UserItems /> : <Navigate to={'/login'} />}
      />

      <Route
        path="/cart"
        element={authTokens ? <Cart /> : <Navigate to={'/login'} />}
      />

      <Route
        path="/purchases-submitted"
        element={
          authTokens ? <PurchaseSubmitted /> : <Navigate to={'/login'} />
        }
      />

      <Route
        path="/guide"
        element={
          <ContentfulProvider client={contentfulClient}>
            <Guide />
          </ContentfulProvider>
        }
      />

      <Route path="/anonymous-users" element={<AnonUsersMngtPage />} />

      <Route
        path="/resend-user-activation"
        element={<ResendUserActivationForm />}
      />

      <Route
        path="/resend-user-activation-submission"
        element={<ResendUserActivationSubmission />}
      />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

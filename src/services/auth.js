import { toast } from 'react-toastify'
import qs from 'qs'

import { config } from '../utils/config/index'

import http, { httpSocial } from './http'

// Requests
// ------------------------------------------------------------------------------

const createUser = async (info) => {
  const response = await http.post('/auth/users/', info)
  if (response.data) {
    return response.data
  }
}

const setAuthTokens = async (credentials) => {
  const response = await http.post('/auth/jwt/create/', credentials)
  if (response.data.access && response.data.refresh) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
    return response.data
  }
}

const requestPasswordReset = async (data) => {
  const response = await http.post('/auth/users/reset_password/', data)
  if (response) return response.data
}

const submitPasswordResetConfirmation = async (data) => {
  const response = await http.post('/auth/users/reset_password_confirm/', data)
  if (response.status === 204) {
    return response.data
  }
}

const requestUsernameReset = async (data) => {
  const response = await http.post('/auth/users/reset_username/', data)
  if (response) return response.data
}

const submitUsernameResetConfirmation = async (data) => {
  const response = await http.post('/auth/users/reset_username_confirm/', data)
  if (response.status === 204) {
    return response.data
  }
}

const requestEmailReset = async (email) => {
  const response = await http.patch('/auth/users/me/', email)
  if (response.status === 200) {
    return response.data
  }
}

const getAuthorizationUrlGoogle = async () => {
  try {
    const response = await http.get(
      `/auth/social/o/google-oauth2/?redirect_uri=${config.base_url}/api/social-credentials/google/`
    )
    if (response) {
      return response
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

const getAuthorizationUrlFacebook = async () => {
  try {
    const response = await http.get(
      `/auth/social/o/facebook/?redirect_uri=${config.base_url}/api/social/facebook/`
    )
    if (response) {
      return response
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

// Social
const setAuthTokensFromSocialFacebook = async (code) => {
  const response = await httpSocial.post(
    '/auth/social/o/facebook/',
    qs.stringify(code)
  )
  console.log(response.data)
  if (response.data) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
    return response.data
  }
}

const setAuthTokensFromSocialGoogle = async (code) => {
  const response = await httpSocial.post(
    '/auth/social/o/google-oauth2/',
    qs.stringify(code)
  )
  //console.log(response.data)
  if (response.data.access && response.data.refresh && response.data.user) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
  }
}

// With Auth Headers

const authUserAccount = async () => {
  const response = await http.get('/auth/users/me/')
  if (response.data) {
    return response.data
  }
}

const deleteUser = async (username) => {
  const response = await http.delete(`/api/users/retrieve-destroy/${username}/`)
  //console.log(response.data.message)
  if (response.status === 204) {
    return response
  }
}

export const authService = {
  setAuthTokens,
  getAuthorizationUrlGoogle,
  getAuthorizationUrlFacebook,
  setAuthTokensFromSocialGoogle,
  setAuthTokensFromSocialFacebook,
  requestPasswordReset,
  submitPasswordResetConfirmation,
  requestEmailReset,
  requestUsernameReset,
  submitUsernameResetConfirmation,
  authUserAccount,
  createUser,
  deleteUser,
}

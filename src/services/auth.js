import axios from 'axios'
import { toast } from 'react-toastify'
import qs from 'qs'

import { config } from '../utils/config/index'

const getAuthTokens = () => {
  const authTokens = JSON.parse(localStorage.getItem('tokens'))
  if (authTokens) return authTokens
}

const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('tokens'))
  //console.log(access_token)
  if (user) {
    return user?.access
  }
}

const getRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem('tokens'))
  if (user) {
    return user?.refresh
  } else {
    toast.error('Refresh token missing!')
  }
}

const removeAuthTokens = () => {
  localStorage.removeItem('tokens')
}

const http = axios.create({
  baseURL: config.base_url,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  headers: {
    'Content-Type': 'application/json',
  },
})

const httpSocial = axios.create({
  baseURL: config.base_url,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const access_token = getAccessToken()
const TOKEN = `Bearer ${access_token}`

const httpAuth = axios.create({
  baseURL: config.base_url,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  headers: {
    Authorization: TOKEN,
  },
})

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
  if (response.data.access && response.data.refresh && response.data.user) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
    return response.data
  }
}

const setAuthTokensFromSocialGoogle = async (code) => {
  const response = await httpSocial.post(
    '/auth/social/o/google-oauth2/',
    qs.stringify(code)
  )
  console.log(response.data)
  if (response.data.access && response.data.refresh && response.data.user) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
  }
}

// With Auth Headers
const authUserAccount = async () => {
  const response = await httpAuth.get('/auth/users/me/')
  if (response.data) {
    return response.data
  }
}

const deleteUser = async (username) => {
  const response = await httpAuth.delete(
    `/api/users/retrieve-destroy/${username}/`
  )
  console.log(response.data.message)
  if (response.status === 204) {
    return response
  }
}

export const authService = {
  setAuthTokens,
  getAuthTokens,
  getAccessToken,
  getRefreshToken,
  getAuthorizationUrlGoogle,
  getAuthorizationUrlFacebook,
  setAuthTokensFromSocialGoogle,
  setAuthTokensFromSocialFacebook,
  removeAuthTokens,
  authUserAccount,
  createUser,
  deleteUser,
}

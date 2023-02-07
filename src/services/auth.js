import axios from 'axios'
import { toast } from 'react-toastify'
import qs from 'qs'

import { config } from '../utils/config/index'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const http = axios.create({
  baseURL: config.base_url,
  headers: {
    'Content-Type': 'application/json',
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

const removeAuthTokens = () => {
  localStorage.removeItem('tokens')
}

const getAuthTokens = () => {
  const authTokens = JSON.parse(localStorage.getItem('tokens'))
  if (authTokens) return authTokens
}

const getAccessToken = () => {
  const access_token = JSON.parse(localStorage.getItem('tokens'))
  console.log(access_token)
  if (access_token) {
    return access_token.access
  } else {
    return null
  }
}

const getRefreshToken = () => {
  const refresh_token = getAuthTokens().refresh
  if (refresh_token) return refresh_token
}

const getAuthorizationUrl = async () => {
  try {
    const response = await http.get(
      `/auth/o/google-oauth2/?redirect_uri=${config.base_url}/api/social-credentials/`
    )
    if (response) {
      return response
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

const setAuthTokensFromSocial = async (code) => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const url = 'http://127.0.0.1:8000/auth/o/google-oauth2/'

  const response = await http.post(url, qs.stringify(code), config)
  console.log(response.data)
  if (response.data.access && response.data.refresh && response.data.user) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
  }
}

const authHttp = axios.create({
  baseURL: config.base_url,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getAccessToken(),
  },
})

const authUserAccount = async () => {
  const response = await authHttp.get('/auth/users/me/')
  if (response.data) {
    return response.data
  }
}

export const authService = {
  setAuthTokens,
  getAuthTokens,
  getAccessToken,
  getRefreshToken,
  getAuthorizationUrl,
  setAuthTokensFromSocial,
  removeAuthTokens,
  authUserAccount,
  createUser,
}
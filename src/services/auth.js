import axios from 'axios'
import { toast } from 'react-toastify'

import { config } from '../utils/config/config'

const http = axios.create({
  baseURL: config.base_url,
  headers: {
    'Content-Type': 'application/json',
  },
})

const setAuthTokens = async (credentials) => {
  const response = await http.post('/auth/jwt/create/', credentials)
  if (response.data.access && response.data.refresh) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
  }
}

const getAuthTokens = () => {
  const authTokens = JSON.parse(localStorage.getItem('tokens'))
  if (authTokens) return authTokens
}

const getAccessToken = () => {
  const access_token = getAuthTokens().access
  if (access_token) return access_token
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

export const authService = {
  setAuthTokens,
  getAuthTokens,
  getAccessToken,
  getRefreshToken,
  getAuthorizationUrl,
}

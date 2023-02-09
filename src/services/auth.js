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
  const user = JSON.parse(localStorage.getItem('tokens'))
  //console.log(access_token)
  if (user) {
    return user?.access
  } else {
    return null
  }
}

const getRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem('tokens'))
  if (user) {
    return user?.refresh
  } else {
    return null
  }
}

const getAuthorizationUrlGoogle = async () => {
  try {
    const response = await http.get(
      `/auth/o/google-oauth2/?redirect_uri=${config.base_url}/api/social-credentials/google/`
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
      `/auth/o/facebook/?redirect_uri=${config.base_url}/api/social-credentials/facebook/`
    )
    if (response) {
      return response
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`)
  }
}

//
const setAuthTokensFromSocialGoogle = async (code) => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const url = config.google_social_oauth_url

  const response = await http.post(url, qs.stringify(code), config)
  console.log(response.data)
  if (response.data.access && response.data.refresh && response.data.user) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
  }
}

const setAuthTokensFromSocialFacebook = async (code) => {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const url = config.facebook_social_oauth_url

  const response = await http.post(url, qs.stringify(code), config)
  console.log(response.data)
  if (response.data.access && response.data.refresh && response.data.user) {
    localStorage.setItem('tokens', JSON.stringify(response.data))
  }
}

// With Auth Headers

const instance = axios.create({
  baseURL: config.base_url,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getAccessToken(),
  },
})

const authUserAccount = async () => {
  const response = await instance.get('/auth/users/me/')
  if (response.data) {
    return response.data
  }
}

const deleteUser = async (credentials) => {
  const response = await instance.delete('/auth/users/me/', credentials)
  if (response.status === 204) {
    toast.success('Account deleted!')
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

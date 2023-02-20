import axios from 'axios'

import { config } from '../utils/config/index'

const baseURL = config.base_url

// Token-Based Auth

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('fabricatorAuthtoken'))
  if (user) return user
}

const removeAuthToken = () => {
  localStorage.removeItem('fabricatorAuthtoken')
}

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  timeout: 60000,
})

// Interceptor
instance.interceptors.request.use(
  (config) => {
    const _auth_token = getAuthToken()
    if (_auth_token) {
      config.headers['Authorization'] = `Token ${_auth_token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const tokenAuthLogin = async (credentials) => {
  const response = await instance.post('/auth/token/login/', credentials)

  if (response?.data?.auth_token) {
    localStorage.setItem(
      'fabricatorAuthtoken',
      JSON.stringify(response?.data?.auth_token)
    )
    return response?.data?.auth_token
  }
}

const tokenAuthLogout = async () => {
  try {
    if (getAuthToken() !== null) {
      const response = await instance.post('/auth/token/logout/')
      if (response.status === 204) {
        return response
      }
    }
  } catch (error) {
    return null
  }
}

const allUsersCount = async () => {
  const response = await instance.get('/api/user-counts/')
  return response.data
}
const fabricatedUsersCount = async () => {
  const response = await instance.get('/api/user-fabricated-counts/')
  return response.data
}
const unfabricatedUsersCount = async () => {
  const response = await instance.get('/api/user-unfabricated-counts/')
  return response.data
}
const allItemsCount = async () => {
  const response = await instance.get('/api/item-counts/')
  return response.data
}
const fabricatedItemsCount = async () => {
  const response = await instance.get('/api/item-fabricated-counts')
  return response.data
}
const unfabricatedItemsCount = async () => {
  const response = await instance.get('/api/item-unfabricated-counts/')
  return response.data
}

export const fabricatorService = {
  tokenAuthLogin,
  tokenAuthLogout,
  getAuthToken,
  removeAuthToken,
  allUsersCount,
  allItemsCount,
  fabricatedUsersCount,
  fabricatedItemsCount,
  unfabricatedUsersCount,
  unfabricatedItemsCount,
}

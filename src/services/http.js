import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

import { config } from '../utils/config/index'
import tokenService from './token'

const baseURL = config.base_url

export const httpSocial = axios.create({
  baseURL: config.base_url,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  timeout: 180000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const http = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  timeout: 180000,
})

// Interceptor
http.interceptors.request.use(
  (config) => {
    const _access = tokenService.getAccessToken()
    if (_access) {
      config.headers['Authorization'] = `Bearer ${_access}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const refreshAuthLogic = async (failedRequest) => {
  const response = await http.post('/auth/jwt/refresh/', {
    refresh: tokenService.getRefreshToken(),
  })

  tokenService.updateAccessToken(response?.data?.access)
  failedRequest.response.config.headers['Authorization'] =
    'Bearer ' + response?.data?.access

  return Promise.resolve()
}

createAuthRefreshInterceptor(http, refreshAuthLogic)

export default http

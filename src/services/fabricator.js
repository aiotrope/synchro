import axios from 'axios'

import { config } from '../utils/config/index'

const baseURL = config.base_url

// Token-Based Auth

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  timeout: 80000,
})

// Interceptor
instance.interceptors.request.use(
  (config) => {
    const generatorToken = process.env.REACT_APP_FABRICATOR_TOKEN
    //console.log(generatorToken)
    //
    if (generatorToken) {
      config.headers['Authorization'] = `Token ${generatorToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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
  if (response?.data) return response?.data?.item_count
}
const fabricatedItemsCount = async () => {
  const response = await instance.get('/api/item-fabricated-counts/')
  return response.data
}
const unfabricatedItemsCount = async () => {
  const response = await instance.get('/api/item-unfabricated-counts/')
  return response.data
}

export const fabricatorService = {
  allUsersCount,
  allItemsCount,
  fabricatedUsersCount,
  fabricatedItemsCount,
  unfabricatedUsersCount,
  unfabricatedItemsCount,
}

export default instance

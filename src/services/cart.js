import http from './http'

const createCart = async (data) => {
  const response = await http.post('/api/carts/', data)
  if (response) return response?.data
}

const fetchCart = async () => {
  const response = await http.get('/api/carts/')
  if (response) return response?.data
}

const deleteCart = async (cartId) => {
  const response = await http.delete(`/api/carts/${cartId}/`)
  if (response.status === 204) return response
}

const cartService = {
  createCart,
  fetchCart,
  deleteCart,
}

export default cartService

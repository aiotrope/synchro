import http from './http'

const createPurchase = async (data) => {
  const response = await http.post('/api/purchases/', data)
  if (response) return response?.data?.results
}

const purchaseService = {
  createPurchase,
}

export default purchaseService

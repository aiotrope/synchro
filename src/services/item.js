import http from './http'

const fetchItem = async (id) => {
  const response = await http.get(`/api/items/${id}/`)
  if (response) {
    //console.log(response)
    return response?.data
  }
}

const fetchUserItems = async () => {
  const response = await http.get('/api/item-owned/')
  if (response) return response?.data
}

const createItem = async (dataObj) => {
  const response = await http.post('/api/items/', dataObj)
  if (response) response?.data
}

const fetchUserPurchaseItems = async () => {
  const response = await http.get('/api/purchases/')
  if (response) return response?.data
}

const fetchUserSoldItems = async () => {
  const response = await http.get('/api/purchases-seller/')
  if (response) return response?.data
}

const itemService = {
  fetchItem,
  fetchUserItems,
  createItem,
  fetchUserPurchaseItems,
  fetchUserSoldItems,
}

export default itemService

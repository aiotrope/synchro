import http from './http'

const fetchItems = async (currentPage) => {
  const response = await http.get(`/api/items/?page=${currentPage}`)
  if (response) {
    return response?.data
  }
}

const shopService = {
  fetchItems,
}

export default shopService

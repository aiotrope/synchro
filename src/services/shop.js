import http from './http'

const fetchItems = async (currentPage) => {
  const response = await http.get(`/api/items/?page=${currentPage}`)
  if (response) {
    return response?.data
  }
}

const search = async (nameSearch) => {
  const response = await http.get(`/api/items/?search=${nameSearch}`)

  if (response) return response?.data?.results
}

const shopService = {
  fetchItems,
  search,
}

export default shopService

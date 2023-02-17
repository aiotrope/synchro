import http from './http'

const createContactMessage = async (dataObj) => {
  const response = await http.post('/api/contacts/', dataObj)
  if (response.status === 201) {
    return response.data
  }
}

const fetchContactMessagesByUser = async () => {
  const response = await http.get('/api/contacts/')
  if (response.status === 200) {
    return response?.data
  }
}

const contactService = {
  createContactMessage,
  fetchContactMessagesByUser,
}

export default contactService

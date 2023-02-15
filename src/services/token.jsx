import { toast } from 'react-toastify'

const getAuthTokens = () => {
  const authTokens = JSON.parse(localStorage.getItem('tokens'))
  if (authTokens) return authTokens
}

const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem('tokens'))
  //console.log(access_token)
  if (user) {
    return user?.access
  }
}

const getRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem('tokens'))
  if (user) {
    return user?.refresh
  } else {
    toast.error('Refresh token missing!')
  }
}

const updateAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem('tokens'))
  user.access = token
  localStorage.setItem('tokens', JSON.stringify(user))
}

const removeAuthTokens = () => {
  localStorage.removeItem('tokens')
}

const tokenService = {
  getAuthTokens,
  getAccessToken,
  removeAuthTokens,
  updateAccessToken,
  getRefreshToken,
}

export default tokenService

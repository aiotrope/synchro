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

const setAuthUser = (userId) => {
  localStorage.setItem('authUser', JSON.stringify(userId))
}

const getAuthUser = () => {
  let userId = JSON.parse(localStorage.getItem('authUser'))
  if (userId) return userId
}

const removeAuthUser = () => {
  localStorage.removeItem('authUser')
}

const tokenService = {
  getAuthTokens,
  getAccessToken,
  removeAuthTokens,
  updateAccessToken,
  getRefreshToken,
  getAuthUser,
  removeAuthUser,
  setAuthUser,
}

export default tokenService

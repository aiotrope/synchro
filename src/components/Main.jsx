import * as React from 'react'

import Container from 'react-bootstrap/Container'

import tokenService from '../services/token'

export const Main = () => {
  const authTokens = tokenService.getAuthTokens()
  return (
    <Container className="wrapper">
      {authTokens ? <h2>Home (Auth)</h2> : <h2>Home</h2>}
    </Container>
  )
}

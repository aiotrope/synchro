import * as React from 'react'

import Container from 'react-bootstrap/Container'
import { authService } from '../services/auth'

export const Main = () => {
  const authTokens = authService.getAuthTokens()
  return (
    <Container className="wrapper">
      {authTokens ? <h2>Home (Auth)</h2> : <h2>Home</h2>}
    </Container>
  )
}

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'

import { authService } from '../services/auth'

export const Me = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['user-account'],
    queryFn: authService.authUserAccount,
  })
  const authTokens = authService.getAuthTokens()

  if (isLoading) {
    return (
      <Spinner
        animation="grow"
        role="status"
        style={{
          position: 'fixed',
          zIndex: 1031,
          top: '50%',
          left: '50%',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  if (!authTokens) {
    return <Navigate to={'/login'} />
  }

  return (
    <Container>
      <h2>Profile</h2>
      <p>ID: {data?.id}</p>
      <p>Username: {data?.username}</p>
      <p>Email: {data.email}</p>
    </Container>
  )
}

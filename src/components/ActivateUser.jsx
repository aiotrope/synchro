import * as React from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

export const ActivateUser = () => {
  return (
    <Container>
      <h2>
        Signup successful! Please{' '}
        <Link to={'/login'}>login to your account</Link>.
      </h2>
    </Container>
  )
}

import React from 'react'
import { QueryCache } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Stack from 'react-bootstrap/Stack'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { authService } from '../services/auth'
import { useCommon } from '../contexts/Common'

const UnAuthMenu = () => (
  <Stack
    direction="horizontal"
    gap={3}
    className="pt-2 px-3"
    style={{ background: '#edf2fa' }}
  >
    <div>
      <h1 className="title">
        <Link to={'/'}>Synchro</Link>
      </h1>
    </div>
    <div>
      <strong>
        <Link to={'/'}>Home</Link>
      </strong>
    </div>
    <div>
      <strong>
        <Link to={'/'}>DEV</Link>
      </strong>
    </div>
    <div className="ms-auto">
      <strong>
        <Link to={'/login'}>LOGIN</Link>
      </strong>
    </div>
    <div>
      <strong>
        <Link to={'/signup'}>SIGNUP</Link>
      </strong>
    </div>
  </Stack>
)

const AuthMenu = () => {
  const queryCache = new QueryCache()
  const navigate = useNavigate()
  const { removeSignedEmail } = useCommon()
  const handleLogout = () => {
    removeSignedEmail()
    queryCache.clear()
    authService.removeAuthTokens()
    window.location.reload()
    const authTokens = authService.getAuthTokens()
    if (!authTokens) {
      navigate('/login')
    }
  }
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="pt-2 px-3"
      style={{ background: '#edf2fa' }}
    >
      <div>
        <h1 className="title">
          <Link to={'/'}>Synchro</Link>
        </h1>
      </div>
      <div>
        <strong>
          <Link to={'/'}>Home</Link>
        </strong>
      </div>
      <div>
        <strong>
          <Link to={'/'}>DEV</Link>
        </strong>
      </div>
      <div className="ms-auto">
        <NavDropdown title="Account" id="navbarScrollingDropdown">
          <LinkContainer to={'/me'}>
            <NavDropdown.Item>Profile</NavDropdown.Item>
          </LinkContainer>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </div>
    </Stack>
  )
}

export const TopNav = () => {
  const authTokens = authService.getAuthTokens()

  console.log(authTokens)
  return <>{authTokens ? <AuthMenu /> : <UnAuthMenu />}</>
}
import React from 'react'
import { QueryCache } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Stack from 'react-bootstrap/Stack'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { useCommon } from '../contexts/Common'
import tokenService from '../services/token'
import http from '../services/http'

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
  const authTokens = tokenService.getAuthTokens()

  React.useEffect(() => {
    if (!authTokens) {
      navigate('/login')
    }
  }, [navigate, authTokens])

  const handleLogout = () => {
    queryCache.clear()
    tokenService.removeAuthTokens()
    tokenService.removeAuthUser()
    removeSignedEmail()
    http.defaults.headers.common['Authorization'] = null
    localStorage.removeItem('init')
    window.location.reload()
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
          <Link to={'/shop'}>Synchro</Link>
        </h1>
      </div>
      <div>
        <strong>
          <Link to={'/contact'}>Contact</Link>
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
          <LinkContainer to={'/user-items'}>
            <NavDropdown.Item>My Items</NavDropdown.Item>
          </LinkContainer>
          <NavDropdown.Divider />
          <LinkContainer to={'/cart'}>
            <NavDropdown.Item>My Orders</NavDropdown.Item>
          </LinkContainer>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </div>
    </Stack>
  )
}

export const TopNav = () => {
  const authUser = tokenService.getAuthTokens()

  if (!authUser) {
    return <UnAuthMenu />
  }

  return <AuthMenu />
}

import React from 'react'
import { Link } from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'

import { authService } from '../services/auth'

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
        <Link to={'/'}>SIGNUP</Link>
      </strong>
    </div>
  </Stack>
)

export const TopNav = () => {
  const authTokens = authService.getAuthTokens()

  return !authTokens ? <UnAuthMenu /> : null
}

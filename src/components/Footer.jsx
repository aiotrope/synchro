import * as React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Stack from 'react-bootstrap/Stack'
import Nav from 'react-bootstrap/Nav'

import tokenService from '../services/token'

export const Footer = () => {
  const authTokens = tokenService.getAuthTokens()
  return (
    <Stack>
      <Nav className="justify-content-center">
        <Nav.Item>
          <LinkContainer to={'/'}>
            <Nav.Link className="text-secondary">Home</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        {authTokens ? (
          <Nav.Item>
            <LinkContainer to={'/contact'}>
              <Nav.Link className="text-secondary">Contact</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        ) : null}
        <Nav.Item>
          <LinkContainer to={'/guide'}>
            <Nav.Link className="text-secondary">Guide</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            href="https://github.com/aiotrope/synchro"
            target="_blank"
            rel="noreferrer"
            className="text-secondary"
          >
            Code
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Stack>
  )
}

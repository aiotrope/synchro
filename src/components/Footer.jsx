import * as React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Stack from 'react-bootstrap/Stack'
import Nav from 'react-bootstrap/Nav'

export const Footer = () => {
  return (
    <Stack>
      <Nav className="justify-content-center">
        <Nav.Item>
          <LinkContainer to={'/'}>
            <Nav.Link className="text-secondary">Home</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to={'/'}>
            <Nav.Link className="text-secondary">Contact</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to={'/dev'}>
            <Nav.Link className="text-secondary">DEV</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            href="https://github.com/aiotrope/synchro"
            className="text-secondary"
          >
            Github
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Stack>
  )
}

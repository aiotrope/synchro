import * as React from 'react'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'

export const AnonUsersMngtPage = () => {
  return (
    <Stack className="col-md-5 mx-auto" style={{ marginBottom: '10rem' }}>
      <h2>User Management</h2>
      <hr />
      <div className="my-5">
        <LinkContainer to={'/password-reset-form'}>
          <Button size="lg" variant="outline-info">
            Reset your password
          </Button>
        </LinkContainer>
      </div>
      <hr />
      <div className="my-5">
        <LinkContainer to={'/username-reset-form'}>
          <Button size="lg" variant="outline-primary">
            Reset your username
          </Button>
        </LinkContainer>
      </div>
      <hr />
      <div className="my-5">
        <LinkContainer to={'/resend-user-activation'}>
          <Button size="lg" variant="outline-warning">
            Resend activation
          </Button>
        </LinkContainer>
        <br />
        <p className="pt-3">
          <span className="text-danger">*</span>No email confirmation will be
          sent to activated users.
        </p>
      </div>
      <hr />
    </Stack>
  )
}

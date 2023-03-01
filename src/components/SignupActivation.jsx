import * as React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

import { useCommon } from '../contexts/Common'

export const SignupActivation = () => {
  const { signedEmail } = useCommon()

  return (
    <Stack className="col-md-5 mx-auto">
      <Alert variant="info">
        <Alert.Heading>Signup Activation</Alert.Heading>
        <p>
          Verify your email address by clicking the link we sent to it at{' '}
          <strong>{signedEmail?.email}</strong>
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <LinkContainer to={'/shop'}>
            <Button variant="outline-info">Go To Shop</Button>
          </LinkContainer>
        </div>
      </Alert>
    </Stack>
  )
}

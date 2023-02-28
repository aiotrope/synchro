import * as React from 'react'
import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'
import { useCommon } from '../contexts/Common'

export const ResendUserActivationSubmission = () => {
  const { signedEmail } = useCommon()
  return (
    <Stack className="col-md-5 mx-auto">
      <Alert variant="info">
        <Alert.Heading>User Activation Submitted</Alert.Heading>
        <p>
          We sent an email at <strong>{signedEmail?.email}</strong> with link to
          activate your account.
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

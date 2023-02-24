import * as React from 'react'
import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'

import { useCommon } from '../contexts/Common'

export const ContactFormSubmitted = () => {
  const { signedEmail } = useCommon()
  return (
    <Stack className="col-md-5 mx-auto">
      <Alert variant="success">
        <Alert.Heading>Contact Message Submitted</Alert.Heading>
        <p>
          A copy of the letter addressed to Synchro will also be forwarded to
          you via email at <strong>{signedEmail?.email}</strong>. Thank you for
          emailing us.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <LinkContainer to={'/shop'}>
            <Button variant="outline-success">Go To Shop</Button>
          </LinkContainer>
        </div>
      </Alert>
    </Stack>
  )
}

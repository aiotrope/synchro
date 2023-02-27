import * as React from 'react'
import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'

import { useCommon } from '../contexts/Common'

export const PurchaseSubmitted = () => {
  const { signedEmail } = useCommon()
  return (
    <Stack className="col-md-5 mx-auto">
      <Alert variant="success">
        <Alert.Heading>Purchases Submitted</Alert.Heading>
        <p>
          Thank you for shopping with us. Email notification of your purchase
          orders will be forwarded to <strong>{signedEmail?.email}</strong>
        </p>
        .
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

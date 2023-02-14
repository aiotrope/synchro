import * as React from 'react'
import Container from 'react-bootstrap/Container'

import { useCommon } from '../contexts/Common'

export const UsernameResetSubmission = () => {
  const { signedEmail } = useCommon()
  return (
    <Container>
      <h2>Username Reset Request Submitted</h2>
      <div>
        <p>
          We sent an email @ <strong>{signedEmail?.email}</strong> with link to
          reset your username.
        </p>
      </div>
    </Container>
  )
}

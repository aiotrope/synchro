import * as React from 'react'
import Container from 'react-bootstrap/Container'

import { useCommon } from '../contexts/Common'

export const PasswordResetSubmission = () => {
  const { signedEmail } = useCommon()
  //console.log(signedEmail?.email)
  return (
    <Container>
      <h2>Password Reset Request Submitted</h2>
      <div>
        <p>
          We sent an email @ <strong>{signedEmail?.email}</strong> with link to
          reset your password.
        </p>
      </div>
    </Container>
  )
}

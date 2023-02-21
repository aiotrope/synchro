import * as React from 'react'
import Container from 'react-bootstrap/Container'

import { useCommon } from '../contexts/Common'

export const SignupActivation = () => {
  const { signedEmail } = useCommon()
  //console.log(signedEmail?.email)
  return (
    <Container>
      <h2>Signup Activation</h2>
      <div>
        <p>
          Please verify your email address by clicking the link we sent to it at{' '}
          <strong>{signedEmail?.email}</strong>
        </p>
        <p>
          Login to the Synchro requires verification after signing up to the
          system.
        </p>
      </div>
    </Container>
  )
}

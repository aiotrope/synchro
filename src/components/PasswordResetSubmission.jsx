import * as React from 'react'
import Stack from 'react-bootstrap/Stack'

import { useCommon } from '../contexts/Common'

export const PasswordResetSubmission = () => {
  const { signedEmail } = useCommon()
  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Password Reset Request Submitted</h2>
      <div>
        <p>
          We sent an email @ <strong>{signedEmail?.email}</strong> with link to
          reset your password.
        </p>
      </div>
    </Stack>
  )
}

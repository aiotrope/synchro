import * as React from 'react'
import Stack from 'react-bootstrap/Stack'

import { useCommon } from '../contexts/Common'

export const UsernameResetSubmission = () => {
  const { signedEmail } = useCommon()
  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Username Reset Request Submitted</h2>
      <div>
        <p>
          We sent an email at <strong>{signedEmail?.email}</strong> with link to
          reset your username.
        </p>
      </div>
    </Stack>
  )
}

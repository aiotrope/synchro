import * as React from 'react'
import Stack from 'react-bootstrap/Stack'

import { useCommon } from '../contexts/Common'

export const ContactFormSubmitted = () => {
  const { signedEmail } = useCommon()
  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Contact Message Submitted</h2>
      <div>
        <p>
          A copy of the letter addressed to Synchro will also be forwarded to
          you via email at <strong>{signedEmail?.email}</strong>. Thank you for
          emailing us.
        </p>
      </div>
    </Stack>
  )
}

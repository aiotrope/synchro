import * as React from 'react'
import { useContentful } from 'react-contentful'
import ReactMarkdown from 'react-markdown'

import Stack from 'react-bootstrap/Stack'

export const Guide = () => {
  const { data } = useContentful({
    contentType: 'documentation',
    query: {},
  })
  const body = data?.items[0].fields.body
  return (
    <Stack className="col-sm-10 mx-auto">
      <ReactMarkdown>{body}</ReactMarkdown>
    </Stack>
  )
}

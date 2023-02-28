import { ContentfulClient } from 'react-contentful'

import { config } from '../utils/config'

export const contentfulClient = new ContentfulClient({
  accessToken: config.contentful_accessToken,
  space: config.contentful_spaceId,
})

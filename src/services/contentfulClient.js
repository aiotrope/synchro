import { createclient } from 'contentful'
import { config } from '../utils/config'

export const client = createclient({
  space: config.contentful_spaceId,
  accesToken: config.contentful_accessToken,
})

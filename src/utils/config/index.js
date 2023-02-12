const BASE_URL = process.env.REACT_APP_BASE_URL
const GOOGLE_CLIENT_ID = process.env.REACT_APP_SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
const GOOGLE_SOCIAL_OAUTH_URL = process.env.REACT_APP_GOOGLE_SOCIAL_OAUTH_URL
const FACEBOOK_CLIENT_ID = process.env.REACT_APP_SOCIAL_AUTH_FACEBOOK_KEY
const FACEBOOK_SOCIAL_OAUTH_URL =
  process.env.REACT_APP_FACEBOOK_SOCIAL_OAUTH_URL

export const config = {
  base_url: BASE_URL,
  google_client_id: GOOGLE_CLIENT_ID,
  google_social_oauth_url: GOOGLE_SOCIAL_OAUTH_URL,
  facebook_social_oauth_url: FACEBOOK_SOCIAL_OAUTH_URL,
  facebook_client_id: FACEBOOK_CLIENT_ID,
}

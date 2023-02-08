const BASE_URL = process.env.REACT_APP_BASE_URL
const GOOGLE_CLIENT_ID = process.env.REACT_APP_SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
const GOOGLE_SOCIAL_OAUTH_URL = process.env.REACT_APP_GOOGLE_SOCIAL_OAUTH_URL
const GOOGLE_SOCIAL_OAUTH_BTN_URL =
  process.env.REACT_APP_GOOGLE_SOCIAL_OAUTH_BTN_URL

export const config = {
  base_url: BASE_URL,
  google_client_id: GOOGLE_CLIENT_ID,
  google_social_oauth_url: GOOGLE_SOCIAL_OAUTH_URL,
  google_social_oauth_btn_url: GOOGLE_SOCIAL_OAUTH_BTN_URL,
}

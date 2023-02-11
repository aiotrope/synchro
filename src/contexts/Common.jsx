import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth'

export const CommonContext = React.createContext()

export const CommonProvider = ({ children }) => {
  const [signedEmail, setSignedEmail] = React.useState(null)
  const googleUrlQuery = useQuery({
    queryKey: ['googleUrl'],
    queryFn: authService.getAuthorizationUrlGoogle,
  })
  /* const facebookUrlQuery = useQuery({
    queryKey: ['facebookUrl'],
    queryFn: authService.getAuthorizationUrlFacebook,
  }) */
  const isComponentMounted = React.useRef(true)

  React.useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  const mounted = isComponentMounted

  const googleLoginUrl = googleUrlQuery?.data?.data?.authorization_url

  //const facebookLoginUrl = facebookUrlQuery?.data?.data?.authorization_url

  const removeSignedEmail = () => setSignedEmail(null)

  const addSignedEmail = (email) => setSignedEmail({ email })

  const value = {
    mounted,
    googleLoginUrl,
    //facebookLoginUrl,
    signedEmail,
    removeSignedEmail: React.useCallback(() => removeSignedEmail(), []),
    addSignedEmail: React.useCallback((email) => addSignedEmail(email), []),
  }

  return (
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  )
}

export const useCommon = () => {
  const {
    mounted,
    googleLoginUrl,
    //facebookLoginUrl,
    signedEmail,
    addSignedEmail,
    removeSignedEmail,
  } = React.useContext(CommonContext)
  return {
    mounted,
    googleLoginUrl,
    //facebookLoginUrl,
    signedEmail,
    addSignedEmail,
    removeSignedEmail,
  }
}

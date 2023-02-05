import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth'

export const CommonContext = React.createContext()

export const CommonProvider = ({ children }) => {
  const googleUrlQuery = useQuery({
    queryKey: ['googleUrl'],
    queryFn: authService.getAuthorizationUrl,
  })
  const isComponentMounted = React.useRef(true)

  React.useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  const mounted = isComponentMounted
  const googleLoginUrl = googleUrlQuery?.data?.data?.authorization_url

  const value = {
    mounted,
    googleLoginUrl,
  }

  return (
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  )
}

export const useCommon = () => {
  const { mounted, googleLoginUrl } = React.useContext(CommonContext)
  return {
    mounted,
    googleLoginUrl,
  }
}

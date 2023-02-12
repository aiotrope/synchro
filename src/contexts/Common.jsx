import * as React from 'react'

export const CommonContext = React.createContext()

export const CommonProvider = ({ children }) => {
  const [signedEmail, setSignedEmail] = React.useState(null)

  const isComponentMounted = React.useRef(true)

  React.useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  const mounted = isComponentMounted

  const removeSignedEmail = () => setSignedEmail(null)

  const addSignedEmail = (email) => setSignedEmail({ email })

  const value = {
    mounted,
    signedEmail,
    removeSignedEmail: React.useCallback(() => removeSignedEmail(), []),
    addSignedEmail: React.useCallback((email) => addSignedEmail(email), []),
  }

  return (
    <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
  )
}

export const useCommon = () => {
  const { mounted, signedEmail, addSignedEmail, removeSignedEmail } =
    React.useContext(CommonContext)
  return {
    mounted,
    signedEmail,
    addSignedEmail,
    removeSignedEmail,
  }
}

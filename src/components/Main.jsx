import * as React from 'react'

//import Container from 'react-bootstrap/Container'

import tokenService from '../services/token'
import { ContactForm } from './ContactForm'

export const Main = () => {
  const authTokens = tokenService.getAuthTokens()
  return <div>{authTokens ? <ContactForm /> : <h2>Home</h2>}</div>
}

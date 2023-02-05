import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { ToastContainer } from 'react-toastify'

import { TopNav } from './components/TopNav'
import { RoutesList } from './components/RoutesList'
import 'react-toastify/dist/ReactToastify.css'

import './utils/scss/_App.scss'

const App = () => {
  return (
    <>
      <header>
        <TopNav />
      </header>
      <Container>
        <ToastContainer />
        <main style={{ marginTop: '6rem' }}>
          <RoutesList />
        </main>
      </Container>
    </>
  )
}

export default App

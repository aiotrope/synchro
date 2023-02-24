import * as React from 'react'
import Container from 'react-bootstrap/Container'
import { ToastContainer } from 'react-toastify'

import { TopNav } from './components/TopNav'
import { RoutesList } from './components/RoutesList'
import { Footer } from './components/Footer'
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
        <main className="mt-5">
          <RoutesList />
        </main>
        <footer>
          <hr />
          <Footer />
        </footer>
      </Container>
    </>
  )
}

export default App

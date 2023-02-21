import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'

import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { fabricatorService, instance } from '../services/fabricator'
import { config } from '../utils/config'

export const Home = () => {
  const tokenMutation = useMutation({
    mutationFn: fabricatorService.tokenAuthLogin,
  })

  const auth_token = fabricatorService.getAuthToken()

  const handleInitial = async () => {
    const obj = {
      username: config.fabricator_username,
      password: config.fabricator_password,
    }
    try {
      const response = await tokenMutation.mutateAsync(obj)
      if (response) {
        const initObj = { name: 'init' }
        const initialize = await instance.post('/api/initial/', initObj)
        if (initialize) return initialize
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (tokenMutation.isLoading) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }
  return (
    <Stack>
      <h2>Home</h2>

      <div className="my-3">
        {auth_token ? (
          <div className="gap-2">
            <p>
              N.B. You accept our terms and conditions by navigating the shop.
            </p>
            <LinkContainer to={'/shop'}>
              <Button variant="light" size="lg">
                Go To Shop
              </Button>
            </LinkContainer>
          </div>
        ) : (
          <div>
            <p>
              Auto-generate 6 new users and 30 new items. Delete all previously
              generated users and items.
            </p>
            <Button variant="light" size="lg" onClick={handleInitial}>
              Initialize
            </Button>
          </div>
        )}
      </div>
    </Stack>
  )
}

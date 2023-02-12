import * as React from 'react'
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'

import { authService } from '../services/auth'
import { config } from '../utils/config'

export const Me = () => {
  const profile = useQuery({
    queryKey: ['user-account'],
    queryFn: authService.authUserAccount,
  })
  const access_token = authService.getAccessToken()
  const AUTH_TOKEN = `Bearer ${access_token}`
  axios.defaults.xsrfCookieName = 'csrftoken'
  axios.defaults.xsrfHeaderName = 'X-CSRFToken'
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  const { isLoading, isError, error, mutate } = useMutation(
    (username) => {
      return axios.delete(
        `${config.base_url}/api/users/retrieve-destroy/${username}/`
      )
    },
    {
      onSuccess: () => {
        authService.removeAuthTokens()
        toast.success('Account deleted from Synchro')
        let timer
        timer = setTimeout(() => {
          window.location.reload()
          clearTimeout(timer)
        }, 8000)
      },
    }
  )
  if (profile.isLoading || isLoading) {
    return (
      <Spinner
        animation="grow"
        style={{
          position: 'fixed',
          zIndex: 1031,
          top: '50%',
          left: '50%',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  if (isError) {
    toast.error(`${error.message} - ${error.response.data.message}`)
  }

  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Profile</h2>
      <p>ID: {profile?.data?.id}</p>
      <p>Username: {profile?.data?.username}</p>
      <p>Email: {profile?.data.email}</p>
      <hr />
      <div className="my-3">
        <h3>Account deletion</h3>
        <Button
          variant="danger"
          size="md"
          onClick={() => mutate(profile?.data?.username)}
        >
          Delete
        </Button>
      </div>
    </Stack>
  )
}

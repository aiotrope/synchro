import * as React from 'react'
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'

import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'

import { authService } from '../services/auth'
import { config } from '../utils/config'

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required()

const setPasswordSchema = yup
  .object({
    new_password: yup.string().trim().required(),
    re_new_password: yup
      .string()
      .oneOf([yup.ref('new_password'), null], 'Password must match'),
    current_password: yup.string().trim().required(),
  })
  .required()
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

  const navigate = useNavigate()

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

  const emailReset = useMutation(
    (email) => {
      return axios.patch(`${config.base_url}/auth/users/me/`, email)
    },
    {
      onSuccess: () => {
        toast.success('Email updated! Prepare for logout')
        let timer
        timer = setTimeout(() => {
          navigate('/')
          authService.removeAuthTokens()
          window.location.reload()
          clearTimeout(timer)
        }, 8000)
      },
      onError: () => toast.error(error.message),
    }
  )

  const passwordUpdate = useMutation(
    (data) => {
      return axios.post(`${config.base_url}/auth/users/set_password/`, data)
    },
    {
      onSuccess: () => {
        toast.success('Password updated! Prepare for logout')
        let timer
        timer = setTimeout(() => {
          navigate('/login')
          authService.removeAuthTokens()
          window.location.reload()
          clearTimeout(timer)
        }, 8000)
      },
      onError: (error) => toast.error(error.message),
    }
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const passwordResetForm = useForm({
    resolver: yupResolver(setPasswordSchema),
    mode: 'all',
  })

  const onSubmit = (data) => {
    emailReset.mutate(data)
    reset()
  }

  const onPasswordReset = (data) => {
    passwordUpdate.mutate(data)
    passwordResetForm.reset()
  }

  if (
    profile.isLoading ||
    isLoading ||
    emailReset.isLoading ||
    passwordUpdate.isLoading
  ) {
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
        <h3>Email Update</h3>
        <p>
          This action will log you out of the system and deactivate your
          account. To reactivate your account, please confirm the links we sent
          to your nominated email address.
        </p>
        <Form
          className="mt-2"
          spellCheck="false"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl
              type="email"
              placeholder="Enter a new email"
              {...register('email')}
              aria-invalid={errors.email?.message ? 'true' : 'false'}
              className={`${errors.email?.message ? 'is-invalid' : ''} `}
            />
            {errors.email?.message && (
              <FormControl.Feedback type="invalid">
                {errors.email?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup className="d-grid mt-3">
            <Button variant="warning" size="lg" type="submit">
              Update Email
            </Button>
          </FormGroup>
        </Form>
      </div>
      <div className="my-3">
        <h3>Password Update</h3>
        <p>This action will log you out of the system.</p>
        <Form
          className="mt-2"
          spellCheck="false"
          noValidate
          onSubmit={passwordResetForm.handleSubmit(onPasswordReset)}
        >
          <FormGroup>
            <FormLabel htmlFor="current_password">Current Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Enter current password"
              {...passwordResetForm.register('current_password')}
              aria-invalid={
                passwordResetForm.formState.errors?.current_password?.message
                  ? 'true'
                  : 'false'
              }
              className={`${
                passwordResetForm.formState.errors?.current_password?.message
                  ? 'is-invalid'
                  : ''
              } `}
            />
            {passwordResetForm.formState.errors?.current_password?.message && (
              <FormControl.Feedback type="invalid">
                {passwordResetForm.formState.errors?.current_password?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="new_password">New Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Enter a new password"
              {...passwordResetForm.register('new_password')}
              aria-invalid={
                passwordResetForm.formState.errors?.new_password?.message
                  ? 'true'
                  : 'false'
              }
              className={`${
                passwordResetForm.formState.errors?.new_password?.message
                  ? 'is-invalid'
                  : ''
              } `}
            />
            {passwordResetForm.formState.errors?.new_password?.message && (
              <FormControl.Feedback type="invalid">
                {passwordResetForm.formState.errors?.new_password?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="re_new_password">
              Re-type new password
            </FormLabel>
            <FormControl
              type="password"
              placeholder="Re-type new password"
              {...passwordResetForm.register('re_new_password')}
              aria-invalid={
                passwordResetForm.formState.errors?.re_new_password?.message
                  ? 'true'
                  : 'false'
              }
              className={`${
                passwordResetForm.formState.errors?.re_new_password?.message
                  ? 'is-invalid'
                  : ''
              } `}
            />
            {passwordResetForm.formState.errors?.re_new_password?.message && (
              <FormControl.Feedback type="invalid">
                {passwordResetForm.formState.errors?.re_new_password?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>

          <FormGroup className="d-grid mt-3">
            <Button variant="warning" size="lg" type="submit">
              Update Password
            </Button>
          </FormGroup>
        </Form>
      </div>
      <hr />
      <div className="my-5">
        <h3>Account Deletion</h3>
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

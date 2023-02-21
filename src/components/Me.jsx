import * as React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, Link } from 'react-router-dom'
import moment from 'moment'

import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import { toast } from 'react-toastify'

import { authService } from '../services/auth'
import contactService from '../services/contact'
import http from '../services/http'
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

  const contactMessagesByUser = useQuery({
    queryKey: ['user-messages'],
    queryFn: contactService.fetchContactMessagesByUser,
  })

  const messages = contactMessagesByUser?.data

  const navigate = useNavigate()

  const { isLoading, isError, error, mutate } = useMutation(
    (username) => {
      return http.delete(
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
      return http.patch(`${config.base_url}/auth/users/me/`, email)
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
      return http.post(`${config.base_url}/auth/users/set_password/`, data)
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
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  if (isError) {
    toast.error(`${error.message} - ${error.response.data.message}`)
  }

  return (
    <Stack className="col-lg-7 mx-auto" style={{ marginBottom: '7rem' }}>
      <div className="mb-4">
        <h2>Profile</h2>
        <p>User ID: {profile?.data?.id}</p>
        <p>Username: {profile?.data?.username}</p>
        <p>Email: {profile?.data.email}</p>
        <hr />
      </div>

      <div className="my-4">
        <h3>Message Sent</h3>
        <Table responsive="xl" size="xl" className="mb-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Message</th>
            </tr>
          </thead>

          <tbody>
            {messages?.map(({ id, subject, messageBody, created }) => (
              <tr key={id}>
                <td>{moment(created.toString()).format('DD-MM-YYYY')}</td>
                <td>{subject}</td>
                <td>{messageBody}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mb-4">
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
          <FormGroup className="mb-4">
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl
              type="email"
              placeholder="Enter a new email"
              {...register('email')}
              aria-invalid={errors.email?.message ? 'true' : 'false'}
              className={`${errors.email?.message ? 'is-invalid' : ''} `}
              size="lg"
            />
            {errors.email?.message && (
              <FormControl.Feedback type="invalid">
                {errors.email?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup className="d-grid mt-3 mb-5">
            <Button variant="warning" size="lg" type="submit">
              Update Email
            </Button>
          </FormGroup>
        </Form>
        <hr />
      </div>
      <div className="mb-4">
        <h3>Password Update</h3>
        <p>This action will log you out of the system.</p>
        <Form
          className="mt-2"
          spellCheck="false"
          noValidate
          onSubmit={passwordResetForm.handleSubmit(onPasswordReset)}
        >
          <FormGroup className="mb-2">
            <FormLabel htmlFor="current_password">
              Current Password<span className="text-danger">*</span>
            </FormLabel>
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
              size="lg"
            />
            {passwordResetForm.formState.errors?.current_password?.message && (
              <FormControl.Feedback type="invalid">
                {passwordResetForm.formState.errors?.current_password?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup className="mb-2">
            <FormLabel htmlFor="new_password">
              New Password<span className="text-danger">*</span>
            </FormLabel>
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
              size="lg"
            />
            {passwordResetForm.formState.errors?.new_password?.message && (
              <FormControl.Feedback type="invalid">
                {passwordResetForm.formState.errors?.new_password?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <FormLabel htmlFor="re_new_password">
              Re-type new password<span className="text-danger">*</span>
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
              size="lg"
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
      <div className="mt-5">
        <h3>Account Deletion</h3>

        <div className="mb-3">
          <p>
            We appreciate having you with us, but we understand that we
            can&apos;t keep you forever.
          </p>
          <small>
            Users who created their accounts using Synchro&apos;s user
            registration system can delete their accounts. Account deletions
            made through social authentication (Google & Facebook) are not yet
            supported by our API. Please{' '}
            <Link to={'/contact'}>contact Synchro</Link> if you want to delete
            your account this way or if you are having difficulty deleting your
            account using both methods.
          </small>
        </div>

        <Button
          variant="danger"
          size="lg"
          onClick={() => mutate(profile?.data?.username)}
        >
          Delete
        </Button>
      </div>
    </Stack>
  )
}

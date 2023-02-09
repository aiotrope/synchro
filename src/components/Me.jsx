import * as React from 'react'
import { useMutation, useQuery, QueryCache } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'

import { authService } from '../services/auth'

export const Me = () => {
  const profile = useQuery({
    queryKey: ['user-account'],
    queryFn: authService.authUserAccount,
  })

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.deleteUser,
  })

  React.useEffect(() => {
    let defaultValues = {}
    defaultValues.email = profile?.data?.email
    reset({ ...defaultValues })
  }, [])

  const schema = yup
    .object({
      email: yup.string().email().required().default(profile?.data?.email),
      current_password: yup.string().trim().required(),
    })
    .required()

  const queryCache = new QueryCache()
  const navigate = useNavigate()

  const user = authService.getAuthTokens()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const onDelete = async (formData) => {
    try {
      await mutateAsync(formData)
      reset()
      authService.removeAuthTokens()
      if (!user || user === null) {
        navigate('/')
        queryCache.clear()
      }
    } catch (error) {
      toast.error(`Error: ${error.message} - ${error.response.data.detail}`)
    }
  }

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

  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Profile</h2>
      <p>ID: {profile?.data?.id}</p>
      <p>Username: {profile?.data?.username}</p>
      <p>Email: {profile?.data.email}</p>
      <div>
        <Form
          className="mt-2"
          spellCheck="false"
          noValidate
          onSubmit={handleSubmit(onDelete)}
        >
          <FormGroup>
            <FormLabel htmlFor="email">Email*</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter your email"
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

          <FormGroup>
            <FormLabel htmlFor="password">Password*</FormLabel>
            <FormControl
              type="password"
              placeholder="Password"
              {...register('current_password')}
              aria-invalid={errors.current_password?.message ? 'true' : 'false'}
              className={`${
                errors.current_password?.message ? 'is-invalid' : ''
              } `}
            />
            {errors.current_password?.message && (
              <FormControl.Feedback type="invalid">
                {errors.current_password?.message}
              </FormControl.Feedback>
            )}
          </FormGroup>

          <FormGroup className="d-grid mt-3">
            <Button variant="danger" size="lg" type="submit">
              Delete your account
            </Button>
          </FormGroup>
        </Form>
      </div>
    </Stack>
  )
}

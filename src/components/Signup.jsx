import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
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
import { useCommon } from '../contexts/Common'

const schema = yup
  .object({
    username: yup.string().trim().min(6).required(),
    email: yup.string().email().required(),
    password: yup.string().trim().min(8).required(),
    re_password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password must match'),
  })
  .required()

export const Signup = () => {
  const queryClient = useQueryClient()
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-account'],
      })
    },
  })

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const handleFBLogin = async () => {
    const req = await authService.getAuthorizationUrlFacebook()
    const url = req?.data?.authorization_url
    window.location.href = url
  }
  const handleGoogleLogin = async () => {
    const req = await authService.getAuthorizationUrlGoogle()
    const url = req?.data?.authorization_url
    window.location.href = url
  }

  const { addSignedEmail } = useCommon()

  const onSubmit = async (userData) => {
    try {
      const result = await mutateAsync(userData)
      addSignedEmail(userData.email)
      if (result) {
        reset()
        navigate('/signup-activation')
      }
    } catch (error) {
      toast.error(`Error: ${error.message} - ${error.response.data.detail}`)
    }
  }
  if (isLoading) {
    return (
      <Spinner animation="border" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }
  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Create an account</h2>

      <div>
        <p>
          Already have an account? <Link to={'/login'}>Login to Synchro</Link>
        </p>
      </div>
      <Form
        className="mt-2"
        spellCheck="false"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup className="mb-2">
          <FormLabel htmlFor="username">
            Username<span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            type="text"
            placeholder="Enter username"
            {...register('username')}
            aria-invalid={errors.username?.message ? 'true' : 'false'}
            className={`${errors.username?.message ? 'is-invalid' : ''} `}
          />
          {errors.username?.message && (
            <FormControl.Feedback type="invalid">
              {errors.username?.message}
            </FormControl.Feedback>
          )}
          <Form.Text muted>
            Username may contain only letters, numbers, and @/./+/-/_
            characters.
          </Form.Text>
        </FormGroup>
        <FormGroup className="mb-2">
          <FormLabel htmlFor="email">
            Email<span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            type="email"
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
        <FormGroup className="mb-2">
          <FormLabel htmlFor="password">
            Password<span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            type="password"
            placeholder="Password"
            {...register('password')}
            aria-invalid={errors.password?.message ? 'true' : 'false'}
            className={`${errors.password?.message ? 'is-invalid' : ''} `}
          />
          {errors.password?.message && (
            <FormControl.Feedback type="invalid">
              {errors.password?.message}
            </FormControl.Feedback>
          )}
          <Form.Text id="passwordHelpBlock" muted>
            8 characters long with small & capital letters, numbers and special
            characters.
          </Form.Text>
        </FormGroup>
        <FormGroup className="mb-4">
          <FormLabel htmlFor="password">
            Password Confirmation<span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            type="password"
            placeholder="Re-enter your password"
            {...register('re_password')}
            aria-invalid={errors.re_password?.message ? 'true' : 'false'}
            className={`${errors.re_password?.message ? 'is-invalid' : ''} `}
          />
          {errors.re_password?.message && (
            <FormControl.Feedback type="invalid">
              {errors.re_password?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>
        <FormGroup className="d-grid mt-3">
          <Button variant="primary" size="lg" type="submit">
            Submit Registration
          </Button>
        </FormGroup>
      </Form>
      <div className="text-center mt-2">
        <strong>OR</strong>
      </div>
      <div className="d-grid my-2">
        <Button variant="light" size="lg" onClick={handleGoogleLogin}>
          Signup via Google
        </Button>
      </div>

      <div className="d-grid mt-1 mb-5">
        <Button variant="light" size="lg" onClick={handleFBLogin}>
          Signup via Facebook
        </Button>
      </div>
    </Stack>
  )
}

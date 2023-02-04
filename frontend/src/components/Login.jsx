import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGoogleLogin } from '@react-oauth/google'

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
    username: yup.string().required('Enter your registered email or username'),
    password: yup.string().required(),
  })
  .required()

export const Login = () => {
  const queryClient = useQueryClient()
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.setAuthTokens,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['googleUrl'] })
    },
  })
  const navigate = useNavigate()
  const { googleLoginUrl } = useCommon()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const onSubmit = async (formData) => {
    try {
      await mutateAsync(formData)
      reset()
      navigate('/')
      toast.success(`Hello ${formData.username}!`)
    } catch (error) {
      toast.error(`Error: ${error.message} - ${error.response.data.detail}`)
    }
  }

  const googleLoginBtn = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (codeResponse) => console.log(codeResponse),
    onError: (error) => console.error('Login Failed:', error),
  })

  if (isLoading) {
    return (
      <Spinner
        animation="grow"
        role="status"
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
      <h2>Login to your account</h2>
      <div>
        <p>
          New to Synchro? <Link to={'/'}>Create an account</Link>
        </p>
      </div>
      <Form
        className="mt-2"
        spellCheck="false"
        noValidate={true}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <FormLabel htmlFor="username">Login</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter your email or username"
            {...register('username')}
            aria-invalid={errors.username?.message ? 'true' : 'false'}
            className={`${errors.username?.message ? 'is-invalid' : ''} `}
          />
          {errors.username?.message && (
            <FormControl.Feedback type="invalid">
              {errors.username?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="password">Password</FormLabel>
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
        </FormGroup>

        <FormGroup className="d-grid mt-3">
          <Button variant="primary" size="lg" type="submit">
            Submit
          </Button>
        </FormGroup>
      </Form>
      <div className="text-center mt-2">
        <strong>OR</strong>
      </div>
      <a href={googleLoginUrl} target="_blank" rel="noreferrer">
        <div className="d-grid mt-1">
          <Button variant="outline-primary" size="lg">
            Login to Google
          </Button>
        </div>
      </a>
      <div className="d-grid mt-1">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => googleLoginBtn()}
        >
          Signin to Google
        </Button>
      </div>
    </Stack>
  )
}

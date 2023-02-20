import React, { useEffect } from 'react'
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
import tokenService from '../services/token'
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
      queryClient.invalidateQueries({
        queryKey: ['user-account', 'user-messages'],
      })
    },
  })

  const navigate = useNavigate()
  const { mounted } = useCommon()
  const authUser = tokenService.getAuthTokens()
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
      const res = await mutateAsync(formData)
      if (res) {
        toast.success(`Hi ${formData.username} you're signed in to Synchro`)
        reset()
        let timer
        setTimeout(() => {
          window.location.reload()
          clearTimeout(timer)
        }, 7000)
      }
    } catch (error) {
      toast.error(`Error: ${error.message} - ${error.response.data.detail}`)
    }
  }

  useEffect(() => {
    const prepare = async () => {
      if (authUser && mounted) {
        navigate('/')
      }
    }
    prepare()
  }, [authUser, mounted])

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

  if (isLoading) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Login to your account</h2>
      <div>
        <p>
          New to Synchro? <Link to={'/signup'}>Create an account</Link>
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
            Login<span className="text-danger">*</span>
          </FormLabel>
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

        <FormGroup className="mb-4">
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
        </FormGroup>

        <FormGroup className="d-grid mt-3">
          <Button variant="primary" size="lg" type="submit">
            Submit
          </Button>
        </FormGroup>
      </Form>
      <div className="mt-1">
        <small>
          Forget your password?{' '}
          <Link to={'/password-reset-form'}>Reset password</Link>
        </small>
      </div>
      <div className="my-1">
        <small>
          Forget your login username?{' '}
          <Link to={'/username-reset-form'}>Reset username</Link>
        </small>
      </div>
      <div className="text-center mt-4">
        <strong>OR</strong>
      </div>

      <div className="d-grid my-2">
        <Button variant="light" size="lg" onClick={handleGoogleLogin}>
          Login via Google
        </Button>
      </div>

      <div className="d-grid mt-1 mb-5">
        <Button variant="light" size="lg" onClick={handleFBLogin}>
          Login via Facebook
        </Button>
      </div>
    </Stack>
  )
}

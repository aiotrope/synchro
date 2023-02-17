import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
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
import { useCommon } from '../contexts/Common'

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required()

export const UsernameResetForm = () => {
  const navigate = useNavigate()
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.requestUsernameReset,
    onSuccess: () => {
      navigate('/username-reset-submission')
    },
  })
  const { addSignedEmail } = useCommon()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmit = async (data) => {
    try {
      addSignedEmail(data?.email)
      await mutateAsync(data)
      reset()
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <Spinner animation="border" className="spinner">
        <span className="visually-hidden">Submitting...</span>
      </Spinner>
    )
  }

  return (
    <Stack className="col-md-5 mx-auto">
      <h2>Username Reset</h2>
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
            placeholder="Enter your registered email"
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
          <Button variant="primary" size="lg" type="submit">
            Submit
          </Button>
        </FormGroup>
      </Form>
    </Stack>
  )
}

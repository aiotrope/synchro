import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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

export const PasswordResetConfirm = () => {
  const { uid, token } = useParams()
  const { removeSignedEmail } = useCommon()
  const navigate = useNavigate()

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.submitPasswordResetConfirmation,
    onSuccess: () => {
      navigate('/login')
      toast.success('Password reset! Login using your new password')
      removeSignedEmail()
    },
  })

  React.useEffect(() => {
    let defaultValues = {}
    defaultValues.uid = uid
    defaultValues.token = token
    reset({ ...defaultValues })
  }, [uid, token])

  const schema = yup
    .object({
      new_password: yup.string().required(),
      re_new_password: yup
        .string()
        .oneOf([yup.ref('new_password'), null], 'Password must match'),
      uid: yup.string().required().default(uid),
      token: yup.string().required().default(token),
    })
    .required()

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
    console.log(data)
    try {
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
      <h2>Password Reset Confirmation</h2>
      <Form
        className="mt-2"
        spellCheck="false"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <FormLabel htmlFor="new_password">New Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter new password"
            {...register('new_password')}
            aria-invalid={errors?.new_password?.message ? 'true' : 'false'}
            className={`${errors?.new_password?.message ? 'is-invalid' : ''} `}
          />
          {errors?.new_password?.message && (
            <FormControl.Feedback type="invalid">
              {errors?.new_password?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="re_new_password">Re-type new password</FormLabel>
          <FormControl
            type="password"
            placeholder="Re-enter your new password"
            {...register('re_new_password')}
            aria-invalid={errors?.re_new_password?.message ? 'true' : 'false'}
            className={`${
              errors?.re_new_password?.message ? 'is-invalid' : ''
            } `}
          />
          {errors?.re_new_password?.message && (
            <FormControl.Feedback type="invalid">
              {errors?.re_new_password?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>
        <FormGroup>
          <FormControl
            type="hidden"
            {...register('uid')}
            aria-invalid={errors?.uid?.message ? 'true' : 'false'}
            className={`${errors?.uid?.message ? 'is-invalid' : ''} `}
          />
          {errors?.uid?.message && (
            <FormControl.Feedback type="invalid">
              {errors?.uid?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>
        <FormGroup>
          <FormControl
            type="hidden"
            {...register('token')}
            aria-invalid={errors?.token?.message ? 'true' : 'false'}
            className={`${errors?.token?.message ? 'is-invalid' : ''} `}
          />
          {errors?.token?.message && (
            <FormControl.Feedback type="invalid">
              {errors?.token?.message}
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

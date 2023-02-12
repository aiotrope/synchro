import * as React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormLabel from 'react-bootstrap/FormLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import Stack from 'react-bootstrap/Stack'

import { authService } from '../services/auth'

export const SocialCredentialsFacebook = () => {
  const queryClient = useQueryClient()
  const [queryParameters] = useSearchParams()
  const { isLoading, error, mutateAsync } = useMutation({
    mutationFn: authService.setAuthTokensFromSocialFacebook,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-account'],
      })
    },
  })

  const navigate = useNavigate()

  const code = queryParameters.get('code')
  const state = queryParameters.get('state')

  const schema = yup
    .object({
      code: yup.string().required().default(code),
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

  React.useEffect(() => {
    let defaultValues = {}
    defaultValues.code = code
    defaultValues.code = state
    reset({ ...defaultValues })
  }, [])

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data)
      reset()
      navigate('/')
      window.location.reload()
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }

  if (error) {
    toast.error(error.message)
  }

  if (isLoading) {
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
      <h2>Social Authentication (Facebook)</h2>
      <div>
        <p>Press the ENTER to signin to the site!</p>
        <small>CODE: {code}</small>
        <small>STATE: {state}</small>
      </div>
      <Form
        className="mt-2"
        spellCheck="false"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <FormLabel htmlFor="code">Code</FormLabel>
          <FormControl
            type="hidden"
            placeholder={queryParameters.get('code')}
            {...register('code')}
            aria-invalid={errors.code?.message ? 'true' : 'false'}
            className={`${errors.code?.message ? 'is-invalid' : ''} `}
          />
          {errors.code?.message && (
            <FormControl.Feedback type="invalid">
              {errors.code?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="state">State</FormLabel>
          <FormControl
            type="hidden"
            placeholder={queryParameters.get('state')}
            {...register('state')}
            aria-invalid={errors.state?.message ? 'true' : 'false'}
            className={`${errors.state?.message ? 'is-invalid' : ''} `}
          />
          {errors.state?.message && (
            <FormControl.Feedback type="invalid">
              {errors.state?.message}
            </FormControl.Feedback>
          )}
        </FormGroup>
        <FormGroup className="d-grid mt-3">
          <Button variant="primary" size="lg" type="submit">
            ENTER
          </Button>
        </FormGroup>
      </Form>
    </Stack>
  )
}

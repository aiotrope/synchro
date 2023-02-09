import * as React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, QueryCache, useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Spinner from 'react-bootstrap/Spinner'
import { toast } from 'react-toastify'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Stack from 'react-bootstrap/Stack'

import { authService } from '../services/auth'

export const SocialCredentialsGoogle = () => {
  const queryClient = useQueryClient()
  const queryCache = new QueryCache()
  const [queryParameters] = useSearchParams()
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.setAuthTokensFromSocialGoogle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-account', 'googleUrl', 'facebookUrl'],
      })
    },
  })

  const navigate = useNavigate()

  const code = queryParameters.get('code')

  const schema = yup
    .object({
      code: yup.string().required().default(code),
    })
    .required()

  const currentUser = authService.getAuthTokens()

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
    reset({ ...defaultValues })
  }, [])

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data)
      reset()
      navigate('/')
      if (currentUser?.user) {
        toast.success(`Hi ${currentUser?.user}!`)
      } else return null
    } catch (error) {
      toast.error(`Error: ${error.message} - ${error.response.data.detail}`)
    } finally {
      queryCache.clear()
      //window.location.reload()
    }
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
      <h2>Social Authentication (Google)</h2>
      <div>
        <p>Press the ENTER to signin to the site!</p>
        <p>CODE: {code}</p>
      </div>
      <Form
        className="mt-2"
        spellCheck="false"
        noValidate={true}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <FormLabel htmlFor="code">Login to Synchro</FormLabel>
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
        <FormGroup className="d-grid mt-3">
          <Button variant="primary" size="lg" type="submit">
            ENTER
          </Button>
        </FormGroup>
      </Form>
    </Stack>
  )
}

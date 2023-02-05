import * as React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Spinner from 'react-bootstrap/Spinner'

import { authService } from '../services/auth'

const schema = yup
  .object({
    code: yup.string().required(),
  })
  .required()

export const Credentials = () => {
  const [queryParameters] = useSearchParams()
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: authService.setAuthTokensFromSocial,
  })

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
    <div>
      Credential
      <p>CODE: {queryParameters.get('code')}</p>
    </div>
  )
}

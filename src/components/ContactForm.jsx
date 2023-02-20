import * as React from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from 'react-bootstrap/InputGroup'
import { toast } from 'react-toastify'

import contactService from '../services/contact'
import { useCommon } from '../contexts/Common'
import { authService } from '../services/auth'

export const ContactForm = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: contactService.createContactMessage,
    onSuccess: () => {
      navigate('/contact-form-submitted')
      toast.success('Message submitted!')
      queryClient.invalidateQueries({
        queryKey: ['user-account'],
      })
    },
  })
  const profile = useQuery({
    queryKey: ['user-account'],
    queryFn: authService.authUserAccount,
  })

  const { addSignedEmail } = useCommon()

  const schema = yup.object().shape({
    subject: yup.string().trim().min(4).required(),
    usernameInfo: yup.string().trim().default(profile?.data?.username),
    emailInfo: yup.string().email().default(profile?.data?.email),
    first_name: yup.string().trim().notRequired(),
    last_name: yup.string().trim().notRequired(),
    messageBody: yup.string().trim().required(),
  })

  const emailInfo = profile?.data?.email
  const usernameInfo = profile?.data?.username

  React.useEffect(() => {
    let defaultValues = {}
    defaultValues.emailInfo = emailInfo
    defaultValues.usernameInfo = usernameInfo
    reset({ ...defaultValues })
  }, [emailInfo, usernameInfo])

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
      const result = await mutateAsync(data)
      if (result) {
        addSignedEmail(emailInfo)
        reset()
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }
  return (
    <Stack className="col-md-6 mx-auto">
      <h2>Hello, World!</h2>
      <p>
        Share your opinions, leave feedback, pose a question, or ask anything
        under the sun.
      </p>
      <p>
        Your message will be forwarded to Synchro via your registered email
        address, which is labeled as read-only in the input field.
      </p>
      <Form
        className="mt-2"
        spellCheck="false"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-2">
          <em>
            <span className="text-danger">*</span> Required
          </em>
        </div>

        <InputGroup className="mb-3" size="lg">
          <InputGroup.Text>
            Subject<span className="text-danger">*</span>
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Enter subject"
            {...register('subject')}
            aria-invalid={errors.subject?.message ? 'true' : 'false'}
            className={`${errors.subject?.message ? 'is-invalid' : ''} `}
          />
          {errors.subject?.message && (
            <FormControl.Feedback type="invalid">
              {errors.subject?.message}
            </FormControl.Feedback>
          )}
        </InputGroup>

        <InputGroup className="my-4" size="lg">
          <InputGroup.Text>Name</InputGroup.Text>
          <FormControl
            type="text"
            placeholder="First name"
            {...register('first_name')}
            aria-invalid={errors.first_name?.message ? 'true' : 'false'}
            className={`${errors.first_name?.message ? 'is-invalid' : ''} `}
          />
          <FormControl
            type="text"
            placeholder="Last name"
            {...register('last_name')}
            aria-invalid={errors.last_name?.message ? 'true' : 'false'}
            className={`${errors.last_name?.message ? 'is-invalid' : ''} `}
          />
        </InputGroup>
        <InputGroup size="lg" className="mb-4">
          <InputGroup.Text>
            Message<span className="text-danger">*</span>
          </InputGroup.Text>
          <FormControl
            as="textarea"
            {...register('messageBody')}
            placeholder="message here..."
            aria-invalid={errors.messageBody?.message ? 'true' : 'false'}
            className={`${
              errors.messageBody?.message ? 'is-invalid' : ''
            } form-control`}
            rows="3"
          >
            {errors.messageBody?.message && (
              <FormControl.Feedback type="invalid">
                {errors.messageBody?.message}
              </FormControl.Feedback>
            )}
          </FormControl>
        </InputGroup>
        <InputGroup>
          <InputGroup.Text>Username and Email</InputGroup.Text>
          <FormControl
            type="text"
            placeholder={profile?.data?.username}
            {...register('usernameInfo')}
            aria-invalid={errors.usernameInfo?.message ? 'true' : 'false'}
            className={`${errors.usernameInfo?.message ? 'is-invalid' : ''} `}
            readOnly
          />
          <FormControl
            type="email"
            placeholder={profile?.data?.email}
            {...register('emailInfo')}
            aria-invalid={errors.emailInfo?.message ? 'true' : 'false'}
            className={`${errors.emailInfo?.message ? 'is-invalid' : ''} `}
            readOnly
          />
        </InputGroup>
        <FormGroup className="d-grid my-5">
          <Button variant="outline-secondary" size="lg" type="submit">
            Submit
          </Button>
        </FormGroup>
      </Form>
    </Stack>
  )
}

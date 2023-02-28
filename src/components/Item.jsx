import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { Currency } from 'react-intl-number-format'

import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'

import itemService from '../services/item'
import tokenService from '../services/token'
import http from '../services/http'
import cartService from '../services/cart'

const regx = /^[0-9]+(\.[0-9][0-9]?)?$/gm

export const Item = () => {
  const [show, setShow] = React.useState(false)
  const queryClient = useQueryClient()
  const { id } = useParams()
  const { isLoading, data } = useQuery(['item', id], () =>
    itemService.fetchItem(id)
  )
  const authTokens = tokenService.getAuthTokens()
  const authUser = tokenService.getAuthUser()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const navigate = useNavigate()

  const schema = yup.object({
    name: yup.string().min(5).trim().default(data?.name),
    description: yup.string().min(8).trim().default(data?.description),
    price_entry: yup
      .number()
      .test('is-decimal', 'invalid decimal', (value) =>
        (value + '').match(regx)
      )
      .positive()
      .default(data?.price_entry),
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

  const updateItemMutation = useMutation({
    mutationFn: (data) => http.patch(`/api/items/${id}/`, data),
    onSuccess: () => {
      reset()
      handleClose()
      alert('Item updated')
      queryClient.invalidateQueries({
        queryKey: ['user-items', 'item', 'all-shop-items'],
      })
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: () => http.delete(`/api/items/${id}/`),
    onSuccess: () => {
      alert('Item Deleted')
      navigate('/user-items')
      queryClient.invalidateQueries({
        queryKey: ['user-items', 'item', 'all-shop-items'],
      })
    },
  })

  const cartMutation = useMutation({
    mutationFn: cartService.createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['all-shop-items', 'cart', 'user-items', 'item'],
      })
    },
  })

  React.useEffect(() => {
    let defaultValues = {}
    defaultValues.name = data?.name
    defaultValues.description = data?.description
    defaultValues.price_entry = data?.price_entry
    reset({ ...defaultValues })
  }, [data?.name, data?.description, data?.price_entry])

  const onSubmit = (data) => {
    updateItemMutation.mutate(data)
  }

  const handleLoginToBuy = () => {
    if (!authTokens) {
      toast.warning('Login to select the item!')
    }
  }

  const handleBuyClick = async (data) => {
    const dataObj = { item: data }
    try {
      const res = await cartMutation.mutateAsync(dataObj)
      toast.success(`${res.item_name} added on your My Orders`)
      let timer
      timer = setTimeout(() => {
        window.location.reload()
        clearTimeout(timer)
      }, 7000)
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (updateItemMutation.error) {
    toast.error(updateItemMutation.error.message)
  }

  if (deleteItemMutation.error) {
    toast.error(deleteItemMutation.error.message)
  }

  if (
    isLoading ||
    updateItemMutation.isLoading ||
    deleteItemMutation.isLoading
  ) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  return (
    <Stack className="col-sm-5 mx-auto">
      <div>
        <h2>{data?.name}</h2>
        {authTokens && authUser === data?.merchant_email ? (
          <Button size="lg" variant="warning" onClick={handleShow}>
            Update {data?.name}
          </Button>
        ) : null}

        {/* Start Update Modal */}
        <div>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                spellCheck="false"
                noValidate
              >
                <FormGroup className="mb-2">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl
                    type="text"
                    placeholder={data?.name}
                    {...register('name')}
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    className={`${errors?.name?.message ? 'is-invalid' : ''} `}
                  />
                  {errors.name?.message && (
                    <FormControl.Feedback type="invalid">
                      {errors.name?.message}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup className="mb-2">
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl
                    as="textarea"
                    rows="5"
                    placeholder={data?.description}
                    {...register('description')}
                    aria-invalid={
                      errors.description?.message ? 'true' : 'false'
                    }
                    className={`${
                      errors.description?.message ? 'is-invalid' : ''
                    }
                `}
                  />
                  {errors.description?.message && (
                    <FormControl.Feedback type="invalid">
                      {errors.description?.message}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup className="mb-4">
                  <FormLabel htmlFor="price_entry">Price</FormLabel>
                  <FormControl
                    type="number"
                    step="any"
                    min="0"
                    placeholder={data?.price_entry}
                    {...register('price_entry')}
                    aria-invalid={
                      errors.price_entry?.message ? 'true' : 'false'
                    }
                    className={`${
                      errors.price_entry?.message ? 'is-invalid' : ''
                    } `}
                  />
                  {errors.price_entry?.message && (
                    <FormControl.Feedback type="invalid">
                      {errors.price_entry?.message}
                    </FormControl.Feedback>
                  )}
                  <Form.Text muted>
                    Only dot(.) is permitted as a separator with two decimal
                    places for decimal numbers. E.g. 1234.56 // 123 // 123456.78
                  </Form.Text>
                </FormGroup>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="warning" onClick={() => reset()}>
                    Reset
                  </Button>
                  <Button variant="primary" type="submit">
                    Update Item
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
        {/* Display Single Item */}

        <div>
          <Card>
            <Card.Img variant="top" src={data?.item_image} />
            <Card.Body>
              <Card.Title>{data?.name}</Card.Title>
              <Card.Text>{data?.description}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                <Currency locale="fi-FI" currency="EUR">
                  {data?.price_entry}
                </Currency>
              </ListGroup.Item>
              <ListGroup.Item>On Stock: {data?.on_stock}</ListGroup.Item>
              <ListGroup.Item>
                Seller: {data?.merchant_username} - {data?.merchant_email}
              </ListGroup.Item>
              <ListGroup.Item>Created: {data?.created}</ListGroup.Item>
            </ListGroup>
            {authTokens && authUser === data?.merchant && (
              <Card.Body>
                <div className="d-flex justify-content-around">
                  <Button variant="warning" size="lg" onClick={handleShow}>
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => deleteItemMutation.mutate(data?.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            )}
            {authTokens && authUser !== data?.merchant && (
              <Card.Body>
                <div className="d-flex justify-content-around">
                  <Button
                    variant={data.on_stock === 'Available' ? 'info' : 'light'}
                    size="lg"
                    onClick={() =>
                      data.on_stock === 'Available'
                        ? handleBuyClick(data.id)
                        : null
                    }
                    aria-disabled={data.on_stock === 'Available' ? false : true}
                    disabled={
                      data.on_stock === 'Available' || !cartMutation.isLoading
                        ? false
                        : true
                    }
                  >
                    {data.on_stock === 'Available' ? 'Buy' : data.on_stock}
                  </Button>
                </div>
              </Card.Body>
            )}
            {!authTokens && (
              <Card.Body>
                <Button variant="secondary" onClick={handleLoginToBuy}>
                  Buy
                </Button>
              </Card.Body>
            )}
          </Card>
        </div>
      </div>
    </Stack>
  )
}

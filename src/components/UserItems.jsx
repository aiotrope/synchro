import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LinkContainer } from 'react-router-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'

import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import Badge from 'react-bootstrap/Badge'

import itemService from '../services/item'
import tokenService from '../services/token'

const regx = /^[0-9]+(\.[0-9][0-9]?)?$/gm
const schema = yup
  .object({
    name: yup.string().min(5).trim().required('Name is required'),
    description: yup.string().min(8).trim().required('Description is required'),
    price_entry: yup
      .number()
      .test('is-decimal', 'invalid decimal', (value) =>
        (value + '').match(regx)
      )
      .positive(),
  })
  .required()

export const UserItems = () => {
  const [show, setShow] = React.useState(false)
  const queryClient = useQueryClient()

  const authTokens = tokenService.getAuthTokens()
  const authUser = tokenService.getAuthUser()

  const itemsOwnedByUser = useQuery({
    queryKey: ['user-items'],
    queryFn: itemService.fetchUserItems,
  })

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const addItemMutation = useMutation({
    mutationFn: itemService.createItem,
    onSuccess: () => {
      reset()
      handleClose()
      alert('New item added')
      queryClient.invalidateQueries({
        queryKey: ['user-items', 'all-shop-items'],
      })
    },
  })

  const onSubmit = async (data) => {
    try {
      await addItemMutation.mutateAsync(data)
    } catch (error) {
      toast.error(`Error: ${error.message}`)
    }
  }

  if (itemsOwnedByUser.isLoading || addItemMutation.isLoading) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  return (
    <Stack>
      <div>
        <h2>Items Created</h2>
        <Button size="lg" variant="outline-info" onClick={handleShow}>
          Add New Item
        </Button>

        {/* Start Add Modal */}
        <div>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add new item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                spellCheck="false"
                noValidate
              >
                <FormGroup className="mb-2">
                  <FormLabel htmlFor="name">
                    Name<span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter item name"
                    {...register('name')}
                    aria-invalid={errors.name?.message ? 'true' : 'false'}
                    className={`${errors.name?.message ? 'is-invalid' : ''} `}
                  />
                  {errors.name?.message && (
                    <FormControl.Feedback type="invalid">
                      {errors.name?.message}
                    </FormControl.Feedback>
                  )}
                </FormGroup>
                <FormGroup className="mb-2">
                  <FormLabel htmlFor="description">
                    Description<span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    as="textarea"
                    rows="3"
                    placeholder="Item description"
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
                  <FormLabel htmlFor="price_entry">
                    Price<span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="number"
                    step="any"
                    min="0"
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
                    Add Item
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </div>

        {/* Owner's Item Display */}
        <Row sm={5}>
          {itemsOwnedByUser?.data?.results?.map(
            ({
              id,
              name,
              price,
              item_image,
              on_stock,
              merchant_email,
              merchant,
            }) => (
              <Col key={id} className="my-1">
                <Card border="light">
                  <LinkContainer to={`/item/${id}`}>
                    <Card.Img variant="top" src={item_image} />
                  </LinkContainer>
                  <Card.Body>
                    <Card.Title>{name}</Card.Title>
                  </Card.Body>

                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>Price: €{price}</ListGroup.Item>
                    <ListGroup.Item>
                      On Stock: {on_stock ? 'Available' : 'Not Available'}
                    </ListGroup.Item>
                    <ListGroup.Item>Seller: {merchant_email}</ListGroup.Item>
                  </ListGroup>
                  {authTokens && authUser === merchant ? (
                    <Card.Body>
                      <div className="d-flex justify-content-around">
                        <div>
                          <LinkContainer to={`/item/${id}`}>
                            <Badge bg="warning">Update</Badge>
                          </LinkContainer>
                        </div>
                        <div>
                          <LinkContainer to={`/item/${id}`}>
                            <Badge bg="danger">Delete</Badge>
                          </LinkContainer>
                        </div>
                      </div>
                    </Card.Body>
                  ) : null}
                </Card>
              </Col>
            )
          )}
        </Row>
      </div>
    </Stack>
  )
}

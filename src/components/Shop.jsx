import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Pagination from 'react-js-pagination'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Currency } from 'react-intl-number-format'
import { useDebounce } from 'use-debounce'

import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Badge'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'

import shopService from '../services/shop'
import { fabricatorService } from '../services/fabricator'
import tokenService from '../services/token'
import cartService from '../services/cart'

export const Shop = () => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [nameSearch, setNameSearch] = React.useState(null)
  const [searchValue] = useDebounce(nameSearch, 1000)
  const queryClient = useQueryClient()
  const authTokens = tokenService.getAuthTokens()
  const authUser = tokenService.getAuthUser()

  const { isLoading, data } = useQuery(['all-shop-items', currentPage], () =>
    shopService.fetchItems(currentPage)
  )

  const allItemsCount = useQuery({
    queryKey: ['all-items'],
    queryFn: fabricatorService.allItemsCount,
  })

  const cartMutation = useMutation({
    mutationFn: cartService.createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['all-shop-items', 'cart', 'user-items', 'item'],
      })
    },
  })

  const searchQuery = useQuery(['search', searchValue], () =>
    shopService.search(searchValue)
  )

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

  const allShopItemsCount = allItemsCount?.data

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleSearchChange = async (event) => {
    event.persist()
    setNameSearch(event.target.value)
  }

  if (isLoading || cartMutation.isLoading) {
    return (
      <Spinner animation="border" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  const itemListPaginated = () => (
    <Row className="justify-content-md-center" sm={5}>
      {data?.results.map(
        ({
          id,
          name,
          price_entry,
          item_image,
          on_stock,
          merchant_email,
          merchant,
        }) => (
          <Col key={id}>
            <Card border="light" className="mb-1">
              <LinkContainer to={`/item/${id}`}>
                <Card.Img
                  variant="top"
                  src={item_image}
                  style={{ width: '5rem' }}
                />
              </LinkContainer>
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{merchant_email}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  {' '}
                  <Currency locale="fi-FI" currency="EUR">
                    {price_entry}
                  </Currency>
                </ListGroup.Item>
                <ListGroup.Item>On Stock: {on_stock}</ListGroup.Item>
              </ListGroup>
              {authTokens && authUser !== merchant && (
                <Card.Body>
                  <Button
                    type="button"
                    onClick={() =>
                      on_stock === 'Available' ? handleBuyClick(id) : null
                    }
                    disabled={
                      on_stock === 'Available' || !cartMutation.isLoading
                        ? false
                        : true
                    }
                    aria-disabled={on_stock === 'Available' ? false : true}
                  >
                    {on_stock === 'Available' ? (
                      'Buy'
                    ) : (
                      <span className="text-danger">{on_stock}</span>
                    )}
                  </Button>
                </Card.Body>
              )}
              {authTokens && authUser === merchant && (
                <Card.Body>
                  <div className="d-flex justify-content-around">
                    <div>
                      <Link to={`/item/${id}`}>
                        <Badge bg="warning">Update</Badge>
                      </Link>
                    </div>
                    <div>
                      <Link to={`/item/${id}`}>
                        <Badge bg="danger">Delete</Badge>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              )}
              {!authTokens && (
                <Card.Body>
                  <Badge bg="secondary" onClick={handleLoginToBuy}>
                    {on_stock === 'Available' ? (
                      'Buy'
                    ) : (
                      <span className="text-warning">{on_stock}</span>
                    )}
                  </Badge>
                </Card.Body>
              )}
            </Card>
          </Col>
        )
      )}
    </Row>
  )

  const itemListSearch = () => (
    <Row className="justify-content-md-center" sm={5}>
      {searchQuery?.data?.map(
        ({
          id,
          name,
          price_entry,
          item_image,
          on_stock,
          merchant_email,
          merchant,
        }) => (
          <Col key={id}>
            <Card border="light" className="mb-1">
              <LinkContainer to={`/item/${id}`}>
                <Card.Img
                  variant="top"
                  src={item_image}
                  style={{ width: '5rem' }}
                />
              </LinkContainer>
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{merchant_email}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  {' '}
                  <Currency locale="fi-FI" currency="EUR">
                    {price_entry}
                  </Currency>
                </ListGroup.Item>
                <ListGroup.Item>On Stock: {on_stock}</ListGroup.Item>
              </ListGroup>
              {authTokens && authUser !== merchant && (
                <Card.Body>
                  <Button
                    type="button"
                    onClick={() =>
                      on_stock === 'Available' ? handleBuyClick(id) : null
                    }
                    disabled={on_stock === 'Available' ? false : true}
                    aria-disabled={on_stock === 'Available' ? false : true}
                  >
                    {on_stock === 'Available' ? (
                      'Buy'
                    ) : (
                      <span className="text-danger">{on_stock}</span>
                    )}
                  </Button>
                </Card.Body>
              )}
              {authTokens && authUser === merchant && (
                <Card.Body>
                  <div className="d-flex justify-content-around">
                    <div>
                      <Link to={`/item/${id}`}>
                        <Badge bg="warning">Update</Badge>
                      </Link>
                    </div>
                    <div>
                      <Link to={`/item/${id}`}>
                        <Badge bg="danger">Delete</Badge>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              )}
              {!authTokens && (
                <Card.Body>
                  <Badge bg="secondary" onClick={handleLoginToBuy}>
                    {on_stock === 'Available' ? (
                      'Buy'
                    ) : (
                      <span className="text-warning">{on_stock}</span>
                    )}
                  </Badge>
                </Card.Body>
              )}
            </Card>
          </Col>
        )
      )}
    </Row>
  )
  return (
    <Container fluid="lg">
      <h2>Shop</h2>
      <div className="col-lg-8 mx-auto mt-2 mb-4">
        <Form>
          <Form.Label>Search item</Form.Label>
          <Form.Group>
            <Form.Control
              type="search"
              placeholder="Search item name"
              aria-label="Search"
              onChange={handleSearchChange}
              required
              autoComplete="off"
              size="lg"
            />
          </Form.Group>
        </Form>
        {searchQuery.isLoading && (
          <Spinner animation="border" className="spinner">
            <span className="visually-hidden">Searching...</span>
          </Spinner>
        )}
      </div>

      {!nameSearch && currentPage ? (
        <div>
          <Nav>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={10}
              totalItemsCount={allShopItemsCount}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
              innerClass="pagination"
              itemClass="page-item"
              linkClass="page-link"
            />
          </Nav>

          {itemListPaginated()}

          <Nav className="justify-content-center mt-5">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={10}
              totalItemsCount={allShopItemsCount}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
              innerClass="pagination"
              itemClass="page-item"
              linkClass="page-link"
            />
          </Nav>
        </div>
      ) : (
        itemListSearch()
      )}
    </Container>
  )
}

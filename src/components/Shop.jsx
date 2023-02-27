import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Pagination from 'react-js-pagination'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Currency } from 'react-intl-number-format'

import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Badge'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import shopService from '../services/shop'
import { fabricatorService } from '../services/fabricator'
import tokenService from '../services/token'
import cartService from '../services/cart'

export const Shop = () => {
  const [currentPage, setCurrentPage] = React.useState(1)
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

  if (isLoading || cartMutation.isLoading) {
    return (
      <Spinner animation="border" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  const allShopItemsCount = allItemsCount?.data

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <Container fluid="lg">
      <h2>Shop</h2>
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
    </Container>
  )
}

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import Pagination from 'react-js-pagination'
import { LinkContainer } from 'react-router-bootstrap'
import { toast } from 'react-toastify'

import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'

import Badge from 'react-bootstrap/Badge'

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import shopService from '../services/shop'
import { fabricatorService } from '../services/fabricator'
import tokenService from '../services/token'

export const Shop = () => {
  const [currentPage, setCurrentPage] = React.useState(1)

  const { isLoading, data } = useQuery(['all-shop-items', currentPage], () =>
    shopService.fetchItems(currentPage)
  )

  const authTokens = tokenService.getAuthTokens()
  const authUser = tokenService.getAuthUser()

  const allItemsCount = useQuery({
    queryKey: ['all-items'],
    queryFn: fabricatorService.allItemsCount,
  })

  const handleLoginToBuy = () => {
    if (!authTokens) {
      toast.warning('Login to select the item!')
    }
  }

  if (isLoading) {
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
            price,
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
                  <ListGroup.Item>Price: €{price}</ListGroup.Item>
                  <ListGroup.Item>
                    On Stock: {on_stock ? 'Available' : 'Not Available'}
                  </ListGroup.Item>
                </ListGroup>
                {authTokens && authUser !== merchant && (
                  <Card.Body>
                    <Badge bg="info">Buy</Badge>
                  </Card.Body>
                )}
                {authTokens && authUser === merchant && (
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
                )}
                {!authTokens && (
                  <Card.Body>
                    <Badge bg="secondary" onClick={handleLoginToBuy}>
                      Buy
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

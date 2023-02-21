import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import Pagination from 'react-responsive-pagination'

import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import shopService from '../services/shop'
import { fabricatorService } from '../services/fabricator'

export const Shop = () => {
  const [currentPage, setCurrentPage] = React.useState(1)

  const { isLoading, data } = useQuery(['all-shop-items', currentPage], () =>
    shopService.fetchItems(currentPage)
  )

  const allItemsCount = useQuery({
    queryKey: ['all-items'],
    queryFn: fabricatorService.allItemsCount,
  })

  if (isLoading) {
    return (
      <Spinner animation="border" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  const allShopItemsCount = allItemsCount?.data?.item_count
  const pageSize = 10
  const totalPages = allShopItemsCount / pageSize
  return (
    <Stack>
      <h2>Shop</h2>
      <div className="my-1">
        <Pagination
          current={currentPage}
          total={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <Row md={4}>
        {data?.results?.map(({ id, name, price, item_image }) => (
          <Col key={id} sm={4} className="my-1">
            <Card border="light" bg="light">
              <Card.Img variant="top" src={item_image} />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>€ {price}</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="mt-4">
        <Pagination
          current={currentPage}
          total={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Stack>
  )
}

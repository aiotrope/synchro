import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Currency } from 'react-intl-number-format'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import pkg from 'lodash'

import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Spinner from 'react-bootstrap/Spinner'

import cartService from '../services/cart'
import purchaseService from '../services/purchase'
import { authService } from '../services/auth'
import { useCommon } from '../contexts/Common'

export const Cart = () => {
  const [itemsToPurchase, setItemsToPurchase] = React.useState([])
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { cloneDeep } = pkg

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.fetchCart,
    onSuccess: (data) => {
      setItemsToPurchase(itemsToPurchase.concat(data?.results))
    },
    onError: (error) => toast.error(error.message),
  })

  const userCart = cartQuery?.data?.results
  const bill = cartQuery?.data?.bill
  const numberOfItems = cartQuery?.data?.number_of_items
  const { addSignedEmail } = useCommon()

  const deleteCartMutation = useMutation({
    mutationFn: cartService.deleteCart,
    onSuccess: () => {
      navigate('/cart')
      alert('Cart item deleted.')
      queryClient.invalidateQueries({
        queryKey: ['user-items', 'item', 'all-shop-items', 'cart'],
      })
    },
    onError: (error) => toast.error(error.message),
  })

  const profile = useQuery({
    queryKey: ['user-account'],
    queryFn: authService.authUserAccount,
  })

  const purchaseMutation = useMutation({
    mutationFn: purchaseService.createPurchase,
    onSuccess: () => {
      alert(`You purchased ${numberOfItems} item(s).`)
      addSignedEmail(profile?.data.email)
      navigate('/purchases-submitted')
      queryClient.invalidateQueries({
        queryKey: ['user-items', 'item', 'all-shop-items', 'cart'],
      })
    },
    onError: (error) => toast.error(error.message),
  })

  const handleDeleteCartMutation = async (data) => {
    await deleteCartMutation.mutateAsync(data)
  }

  const handlePurchasing = async () => {
    let items = cloneDeep(itemsToPurchase)
    await Promise.all(
      items.map(({ id }) => {
        const dataObj = { purchases: id }
        purchaseMutation.mutate(dataObj)
      })
    )
  }

  if (deleteCartMutation.isLoading || cartQuery.isLoading) {
    return (
      <Spinner animation="grow" className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }

  return (
    <Stack style={{ marginBottom: '25rem' }}>
      <h2>Orders</h2>
      <div>
        <Table responsive="sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          {userCart?.map(({ id, item_name, item_price_entry }) => (
            <tbody key={id}>
              <tr>
                <td>{item_name}</td>
                <td>
                  <Currency locale="fi-FI" currency="EUR">
                    {item_price_entry}
                  </Currency>
                </td>
                <td>
                  <Badge
                    pill
                    bg="danger"
                    onClick={() => handleDeleteCartMutation(id)}
                  >
                    Delete entry
                  </Badge>
                </td>
              </tr>
            </tbody>
          ))}
          <tbody>
            <tr>
              <td>
                <strong>Total bill for ({numberOfItems}) item/s</strong>
              </td>
              <td>
                <strong>
                  <Currency locale="fi-FI" currency="EUR">
                    {bill}
                  </Currency>
                </strong>
              </td>
              <td>
                <Badge pill bg="primary" onClick={handlePurchasing}>
                  Select All To Pay
                </Badge>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Stack>
  )
}

import express, { NextFunction, Request, Response } from 'express'
import { requestAuthorizer } from './middleware'
import { CreateOrder, DeleteOrder, GetOrder, GetOrdersByCustomerId, UpdateOrder } from '~/services/order'
import { OrderRepository } from '~/repositories/order'
import { CartRepository } from '~/repositories/cart'

const router = express.Router()

const orderRepository = OrderRepository
const cartRepository = CartRepository

// create order
router.post('/orders', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    next(new Error('User not found'))
    return
  }

  const response = await CreateOrder(user.id, orderRepository, cartRepository)

  return res.status(200).json(response)
})

// get all orders
router.get('/orders', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    next(new Error('User not found'))
    return
  }

  const response = await GetOrdersByCustomerId(user.id, orderRepository)

  return res.status(200).json(response)
})

// get order by id
router.get('/orders/:id', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    next(new Error('User not found'))
    return
  }

  const orderId = +req.params.id

  const response = await GetOrder({ customerId: user.id, orderId }, orderRepository)

  return res.status(200).json(response)
})

// update order by id (only called from microservice)
router.patch('/orders/:id', async (req: Request, res: Response, next: NextFunction) => {
  // secure check to allow only from microservice

  const orderId = +req.params.id

  const response = await UpdateOrder({ orderId, status: req.body.status }, orderRepository)

  return res.status(200).json(response)
})

// delete order by id (only called from microservice)
router.delete('/orders/:id', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user
  if (!user) {
    next(new Error('User not found'))
    return
  }

  const orderId = +req.params.id

  const response = await DeleteOrder(orderId, orderRepository)

  return res.status(200).json(response)
})

export { router }
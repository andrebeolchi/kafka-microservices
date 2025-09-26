import express, { Request, Response } from 'express'
import { CartRequestSchema, type CartRequestInput } from '~/dto/cart-request'
import { CartRepository } from '~/repositories/cart'
import { CreateCart, DeleteCart, EditCart, GetCart } from '~/services/cart'
import { validateRequest } from '~/utils/validator'

const router = express.Router()

const cartRepository = CartRepository

const authMiddleware = (_req: Request, res: Response, next: Function) => {
  const isValidUser = true
  if (!isValidUser) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  next()
}

router.use(authMiddleware)

router.post('/cart', async (req: Request, res: Response) => {
  try {
    const error = validateRequest<CartRequestInput>(req.body, CartRequestSchema)

    if (error) {
      return res.status(404).json({ error })
    }

    const response = await CreateCart(req.body, cartRepository)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(404).json({ error })
  }
})

router.get('/cart', async (req: Request, res: Response) => {
  const response = await GetCart(req.body.customerId, cartRepository)
  return res.status(200).json(response)
})

router.patch('/cart/:lineItemId', async (req: Request, res: Response) => {
  const lineItemId = +req.params.lineItemId

  const response = await EditCart({ id: lineItemId, quantity: req.body.quantity }, cartRepository)
  return res.status(200).json(response)
})

router.delete('/cart/:lineItemId', async (req: Request, res: Response) => {
  const lineItemId = +req.params.lineItemId
  const response = await DeleteCart(lineItemId, cartRepository)
  return res.status(200).json(response)
})

export { router }
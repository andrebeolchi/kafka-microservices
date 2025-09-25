import express, { Request, Response } from 'express'
import { CartRequestSchema, type CartRequestInput } from '~/dto/cart-request'
import { CartRepository } from '~/repositories/cart'
import { CreateCart, DeleteCart, EditCart, GetCart } from '~/services/cart'
import { validateRequest } from '~/utils/validator'

const router = express.Router()

const cartRepository = CartRepository

router.post('/cart', async (req: Request, res: Response) => {
  try {
    const error = validateRequest<CartRequestInput>(req.body, CartRequestSchema)
    
    if (error) {
      return res.status(404).json({ error })
    }

    const response = await CreateCart(req.body as CartRequestInput, cartRepository)

    return res.status(200).json(response)
  } catch (error) {
    return res.status(404).json({ error })
  }
})

router.get('/cart', async (req: Request, res: Response) => {
  const response = await GetCart(req.body, cartRepository)
  return res.status(200).json(response)
})

router.patch('/cart', async (req: Request, res: Response) => {
  const response = await EditCart(req.body, cartRepository)
  return res.status(200).json(response)
})

router.delete('/cart', async (req: Request, res: Response) => {
  const response = await DeleteCart(req.body, cartRepository)
  return res.status(200).json(response)
})

export { router }
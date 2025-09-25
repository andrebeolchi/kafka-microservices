import express, { Request, Response } from 'express'
import { CartRepository } from '~/repositories/cart'
import { CreateCart, DeleteCart, EditCart, GetCart } from '~/services/cart'

const router = express.Router()

const cardRepository = CartRepository

router.post('/cart', async (req: Request, res: Response) => {
  const response = await CreateCart(req.body, cardRepository)
  return res.status(200).json(response)
})

router.get('/cart', async (req: Request, res: Response) => {
  const response = await GetCart(req.body, cardRepository)
  return res.status(200).json(response)
})

router.patch('/cart', async (req: Request, res: Response) => {
  const response = await EditCart(req.body, cardRepository)
  return res.status(200).json(response)
})

router.delete('/cart', async (req: Request, res: Response) => {
  const response = await DeleteCart(req.body, cardRepository)
  return res.status(200).json(response)
})

export { router }
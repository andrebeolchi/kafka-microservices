import express, { NextFunction, Request, Response } from 'express'
import { CartRequestSchema, type CartRequestInput } from '~/dto/cart-request'
import { CartRepository } from '~/repositories/cart'
import { CreateCart, DeleteCart, EditCart, GetCart } from '~/services/cart'
import { validateRequest } from '~/utils/validator'
import { requestAuthorizer } from './middleware'

const router = express.Router()

const cartRepository = CartRepository

router.post(
  '/cart',
  requestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        next(new Error('User not found in request'))
        return
      }

      const error = validateRequest<CartRequestInput>(req.body, CartRequestSchema)

      if (error) {
        return res.status(404).json({ error })
      }

      const response = await CreateCart({ ...req.body, customerId: user.id }, cartRepository)

      return res.status(200).json(response)
    } catch (error) {
      return res.status(404).json({ error })
    }
  })

router.get(
  '/cart',
  requestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        next(new Error('User not found in request'))
        return
      }

      const response = await GetCart(user.id, cartRepository)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(404).json({ error })
    }
  })

router.patch(
  '/cart/:lineItemId',
  requestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        next(new Error('User not found in request'))
        return
      }

      const lineItemId = +req.params.lineItemId

      const response = await EditCart({
        id: lineItemId,
        quantity: req.body.quantity,
        customerId: user.id,
      }, cartRepository)

      return res.status(200).json(response)
    } catch (error) {
      return res.status(404).json({ error })
    }
  })

router.delete(
  '/cart/:lineItemId',
  requestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      if (!user) {
        next(new Error('User not found in request'))
        return
      }

      const lineItemId = +req.params.lineItemId

      const response = await DeleteCart({
        id: lineItemId,
        customerId: user.id,
      }, cartRepository)

      return res.status(200).json(response)
    } catch (error) {
      return res.status(404).json({ error })
    }
  })

export { router }
import express, { Request, Response } from 'express'
import { OrderEvent } from '~/types/subscription'
import { MessageBroker } from '~/utils/broker/message'

const router = express.Router()

router.post('/order', async (req: Request, res: Response) => {
  // create order logic here

  const success = await MessageBroker.publish({
    topic: 'OrderEvents',
    headers: {
      token: req.headers.authorization
    },
    event: OrderEvent.CREATE_ORDER,
    message: {
      orderId: 1,
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 }
      ]
    }
  })

  return res.status(200).json({ message: 'Order created', success })
})

router.get('/order', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

router.get('/order/:id', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

router.delete('/order/:id', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

export { router }
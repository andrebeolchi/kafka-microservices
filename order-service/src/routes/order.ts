import express, { Request, Response } from 'express'

const router = express.Router()

router.post('/order', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

router.get('/order', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

router.get('/order/:id', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

router.delete('/order/:id', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Order created' })
})

export { router }
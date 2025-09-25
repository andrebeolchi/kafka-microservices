import express, { Request, Response } from 'express'
import cors from 'cors'

import { router as cartRouter } from './routes/cart'
import { router as orderRouter } from './routes/order'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK')
})

app.use(cartRouter)
app.use(orderRouter)

export { app }
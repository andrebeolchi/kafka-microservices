import express, { Request, Response } from 'express'
import cors from 'cors'

import { router as paymentRoutes } from './routes/payment'
import { HandleErrorWithLogger } from './utils/error/handler'
import { httpLogger } from './utils/logger'
import { initializeBroker } from './services/broker'

export const expressApp = async () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(httpLogger)

  await initializeBroker()

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK')
  })

  app.use(paymentRoutes)

  app.use(HandleErrorWithLogger)

  return app
}
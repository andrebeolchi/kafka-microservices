import express, { Request, Response } from 'express'
import cors from 'cors'

import { router as cartRouter } from './routes/cart'
import { router as orderRouter } from './routes/order'
import { HandleErrorWithLogger } from './utils/error/handler'
import { httpLogger, logger } from './utils/logger'
import { MessageBroker } from './utils/broker/message'
import { Consumer, Producer } from 'kafkajs'

export const expressApp = async () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(httpLogger)

  const producer = await MessageBroker.connectProducer<Producer>()
  producer.on("producer.connect", () => logger.info("Kafka Producer connected - from expressApp"))

  const consumer = await MessageBroker.connectConsumer<Consumer>()
  consumer.on("consumer.connect", () => logger.info("Kafka Consumer connected - from expressApp"))

  await MessageBroker.subscribe((message) => {
    logger.info(`Consumer received message to event ${JSON.stringify(message.event)}`)
  }, "OrderEvents")

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK')
  })

  app.use(cartRouter)
  app.use(orderRouter)

  app.use(HandleErrorWithLogger)

  return app
}
import { Consumer, Producer } from "kafkajs"
import { MessageBroker } from "~/utils/broker/message"
import { logger } from "~/utils/logger"
import { HandleSubscription } from "./order"
import { OrderEvent } from "~/types/subscription"

export const initializeBroker = async () => {
  const producer = await MessageBroker.connectProducer<Producer>()
  producer.on("producer.connect", async () => logger.info("order producer connected successfully"))

  const consumer = await MessageBroker.connectConsumer<Consumer>()
  consumer.on("consumer.connect", async () => logger.info("order consumer connected successfully"))

  await MessageBroker.subscribe(HandleSubscription, 'OrderEvents')
}

export const sendCreateOrderMessage = async (data: Record<string, unknown>) => {
  await MessageBroker.publish({
    event: OrderEvent.CREATE_ORDER,
    topic: 'CatalogEvents',
    headers: {},
    message: data
  })
}

export const sendCancelOrderMessage = async (data: Record<string, unknown>) => {
  await MessageBroker.publish({
    event: OrderEvent.CANCEL_ORDER,
    topic: 'CatalogEvents',
    headers: {},
    message: data
  })
}
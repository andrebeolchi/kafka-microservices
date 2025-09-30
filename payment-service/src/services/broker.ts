import { Producer } from "kafkajs"
import { MessageBroker } from "~/utils/broker/message"
import { logger } from "~/utils/logger"
import { PaymentEvent } from "~/types/subscription"

export const initializeBroker = async () => {
  const producer = await MessageBroker.connectProducer<Producer>()
  producer.on("producer.connect", async () => logger.info("payment producer connected successfully"))
}

export const sendCreatePaymentMessage = async (data: Record<string, unknown>) => {
  await MessageBroker.publish({
    event: PaymentEvent.CREATE_PAYMENT,
    topic: 'OrderEvents',
    headers: {},
    message: data
  })
}
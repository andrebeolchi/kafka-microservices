import { MessageBrokerType, PublishType } from "./type";
import { Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { KAFKA_BROKERS, KAFKA_CLIENT_ID } from "~/config";
import { logger } from "~/utils/logger";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.INFO,
})

let producer: Producer

const createTopic = async (topicList: string[]) => {
  const topics = topicList.map((topic) => ({
    topic,
    numPartitions: 2,
    replicationFactor: 1, // based on number of brokers
  }))

  const admin = kafka.admin()
  await admin.connect()

  const topicExists = await admin.listTopics()

  for (const topic of topics) {
    if (!topicExists.includes(topic.topic)) {
      await admin.createTopics({
        topics: [topic],
      })
    }
  }

  await admin.disconnect()
}

const connectProducer = async <T>(): Promise<T> => {
  await createTopic(["OrderEvents"])

  if (producer) {
    logger.info("Reusing existing Kafka Producer")
    return producer as T
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner
  })

  await producer.connect()
  logger.info("Kafka Order Producer connected")
  return producer as T
}

const disconnectProducer = async (): Promise<void> => {
  if (producer) {
    logger.info("Disconnecting Kafka Producer")
    await producer.disconnect()
  }
}

const publish = async (data: PublishType): Promise<boolean> => {
  const producer = await connectProducer<Producer>()
  const result = await producer.send({
    topic: data.topic,
    messages: [
      {
        headers: data.headers,
        key: data.event,
        value: JSON.stringify(data.message)
      }
    ]
  })
  logger.info(`Message published to topic ${data.topic}`)
  return result.length > 0
}

export const MessageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
}
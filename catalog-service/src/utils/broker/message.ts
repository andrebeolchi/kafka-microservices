import { CatalogEvent, MessageType, TOPIC_TYPE } from "~/types/broker";
import { MessageBrokerType, MessageHandler, PublishType } from "./type";
import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { logger } from "~/utils/logger";
 
const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"]
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "catalog-service"
const KAKFA_GROUP_ID = process.env.KAKFA_GROUP_ID || "catalog-service-group"

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.INFO,
})

let producer: Producer
let consumer: Consumer

const createTopic = async (topicList: TOPIC_TYPE[]) => {
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
  await createTopic(["CatalogEvents"])

  if (producer) {
    logger.info("Reusing existing Kafka Producer")
    return producer as T
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner
  })

  await producer.connect()
  logger.info("Kafka catalog producer connected")
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

const connectConsumer = async <T>(): Promise<T> => {
  if (consumer) {
    logger.info("Reusing existing Kafka Consumer")
    return consumer as unknown as T
  }

  consumer = kafka.consumer({
    groupId: KAKFA_GROUP_ID
  })

  await consumer.connect()
  logger.info("Kafka Consumer connected")
  return consumer as T
}

const disconnectConsumer = async (): Promise<void> => {
  if (consumer) {
    logger.info("Disconnecting Kafka Consumer")
    await consumer.disconnect()
  }
}

const subscribe = async (messageHandler: MessageHandler, topic: TOPIC_TYPE): Promise<void> => {
  const consumer = await connectConsumer<Consumer>()
  await consumer.subscribe({ topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!["CatalogEvents"].includes(topic)) {
        logger.warn(`Received message on unknown topic ${topic}`)
        return
      }

      if (message.key && message.value) {
        const inputMessage: MessageType = {
          headers: message.headers,
          event: message.key.toString() as CatalogEvent,
          data: message.value ? JSON.parse(message.value.toString()) : null
        }

        messageHandler(inputMessage)

        await consumer.commitOffsets([
          { topic, partition, offset: (Number(message.offset) + 1).toString() }
        ])

        logger.info(`Message processed from topic ${topic}, partition ${partition}, offset ${message.offset}`)
      }
    }
  })
}

export const MessageBroker: MessageBrokerType = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe
}
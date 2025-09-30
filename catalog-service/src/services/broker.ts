import { Consumer, Producer } from "kafkajs"
import { CatalogService } from "./catalog"
import { MessageBroker } from "~/utils/broker/message"
import { logger } from "~/utils/logger"

interface BrokerServiceType {
  initializeBroker(): Promise<void>
}

export class BrokerService implements BrokerServiceType {
  private producer: Producer | null = null
  private consumer: Consumer | null = null

  constructor(
    private catalogService: CatalogService
  ) { }

  public async initializeBroker() {
    this.producer = await MessageBroker.connectProducer<Producer>()
    this.producer.on("producer.connect", async () => logger.info("catalog producer connected successfully"))

    this.consumer = await MessageBroker.connectConsumer<Consumer>()
    this.consumer.on("consumer.connect", async () => logger.info("catalog consumer connected successfully"))

    await MessageBroker.subscribe(
      this.catalogService.handleBrokerMessage.bind(this.catalogService),
      'CatalogEvents')
  }
}
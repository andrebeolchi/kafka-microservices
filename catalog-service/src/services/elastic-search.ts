import { EventPayload, EventType } from "~/utils/elastic-search-event-listener";
import { Client } from '@elastic/elasticsearch';
import { CatalogProduct } from "~/dto/payload";
import { logger } from "~/utils/logger";

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

export class ElasticSearchService {
  private indexName = "product"
  private client: Client

  constructor() {
    this.client = new Client({ node: ELASTICSEARCH_URL })
    this.createIndex()
  }

  async handleEvents({ event, data }: EventPayload) {
    logger.info(`Handling event: ${event} for index: ${this.indexName}`)

    const eventHandlers: Record<EventType, Function> = {
      "create-product": async () => {
        await this.createProduct(data as CatalogProduct)
        logger.info("Indexing product in ElasticSearch:")
      },
      "update-product": async () => {
        await this.updateProduct(data as CatalogProduct)
        logger.info("Updating product in ElasticSearch:")
      },
      "delete-product": async () => {
        await this.deleteProduct(data.id as number)
        logger.info("Deleting product from ElasticSearch:")
      },
    }

    eventHandlers[event]()
  }

  async createIndex() {
    const indexExists = await this.client.indices.exists({ index: this.indexName })

    if (!indexExists) {
      await this.client.indices.create({
        index: this.indexName,
        mappings: {
          properties: {
            id: { type: 'keyword' },
            name: { type: 'text' },
            description: { type: 'text' },
            price: { type: 'integer' },
            stock: { type: 'integer' }
          }
        }
      })
    }
  }

  async getProduct(id: number) {
    const result = await this.client.get({
      index: this.indexName,
      id: `${id}`
    })

    return result._source
  }

  async createProduct(data: CatalogProduct) {
    await this.client.index({
      index: this.indexName,
      id: `${data.id}`,
      document: data
    })

    logger.info(`Product indexed in ElasticSearch: ${data.id}`)
  }

  async updateProduct(data: CatalogProduct) {
    await this.client.update({
      index: this.indexName,
      id: `${data.id}`,
      doc: data
    })

    logger.info(`Product updated in ElasticSearch: ${data.id}`)
  }

  async deleteProduct(id: number) {
    await this.client.delete({
      index: this.indexName,
      id: `${id}`
    })

    logger.info(`Product deleted from ElasticSearch: ${id}`)
  }

  async searchProducts(query: string) {
    const result = await this.client.search({
      index: this.indexName,
      query: {
        multi_match: {
          query,
          fields: ['name', 'description'],
          fuzziness: 'AUTO'
        }
      }
    })

    return result.hits.hits.map(hit => hit._source)
  }
}
import { OrderWithLineItems } from "~/types/message";
import { CatalogRepository } from "../interfaces/catalog-repository";
import { logger } from "~/utils/logger";
import { ElasticSearchEventListener } from "~/utils/elastic-search-event-listener";

export class CatalogService {
  constructor(
    private _repository: CatalogRepository
  ) { }

  async createProduct(input: any) {
    const product = await this._repository.create(input)

    if (!product.id) {
      throw new Error("unable to create product")
    }

    ElasticSearchEventListener.instance.notify({
      event: "create-product",
      data: { ...product }
    })

    return product
  }

  async updateProduct(input: any) {
    const product = await this._repository.update(input)

    if (!product.id) {
      throw new Error("unable to update product")
    }

    ElasticSearchEventListener.instance.notify({
      event: "update-product",
      data: { ...product }
    })

    return product
  }

  //TODO - instead of this, implement a search function that queries ElasticSearch
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit, offset)

    return products
  }

  async getProduct(id: number) {
    const product = await this._repository.findOne(id)
    return product
  }

  async deleteProduct(id: number) {
    const deletedId = await this._repository.delete(id)

    ElasticSearchEventListener.instance.notify({
      event: "delete-product",
      data: { id: deletedId }
    })

    return { id: deletedId }
  }

  async getProductStock(ids: number[]) {
    const products = await this._repository.findStock(ids)

    if (!products.length) {
      throw new Error("unable to find product stock details")
    }

    return products
  }

  async handleBrokerMessage(message: any) {
    const { orderItems } = message.data as OrderWithLineItems

    const notFoundIds: number[] = []

    orderItems.forEach(async (item) => {
      const product = await this.getProduct(item.productId)
      if (!product) {
        notFoundIds.push(item.productId)
        return
      } else {
        const updatedStock = product.stock - item.quantity
        await this.updateProduct({ ...product, stock: updatedStock })
      }
    })

    if (notFoundIds.length) {
      logger.warn(`Products not found during stock update for create order: ${notFoundIds.join(", ")}`)
    }
  }
}
import { CatalogRepository } from "../interfaces/catalog-repository";

export class CatalogService {
  constructor(
    private _repository: CatalogRepository
  ) { }

  async createProduct(input: any) {
    const product = await this._repository.create(input)

    if (!product.id) {
      throw new Error("unable to create product")
    }

    return product
  }

  async updateProduct(input: any) {
    const product = await this._repository.update(input)

    //TODO - emit event to update record in ElasticSearch

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

    //TODO - emit event to delete record in ElasticSearch

    return deletedId
  }
}
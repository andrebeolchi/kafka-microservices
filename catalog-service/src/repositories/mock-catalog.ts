import { CatalogRepository } from "~/interfaces/catalog-repository";
import { Product } from "~/models/product";

export class MockCatalogRepository implements CatalogRepository {
  async create(data: Product): Promise<Product> {
    const product: Product = {
      ...data,
      id: Math.floor(Math.random() * 1000),
    }

    return product
  }

  async update(data: Product): Promise<Product> {
    return data
  }

  async delete(id: number): Promise<number> {
    return id
  }

  async find(_limit: number, _offset: number): Promise<Product[]> {
    return []
  }

  async findOne(id: number): Promise<Product> {
    return { id } as Product
  }
}
import { CatalogRepository } from "~/interfaces/catalog-repository";
import { Product } from "~/models/product";

export class PrismaCatalogRepository implements CatalogRepository {
  async create(data: Product): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  async update(data: Product): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async find(_limit: number, _offset: number): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }

  async findOne(id: number): Promise<Product> {
    throw new Error("Method not implemented.");
  }
}
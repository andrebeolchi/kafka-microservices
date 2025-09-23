import { CatalogRepository } from "../interfaces/catalog-repository";
import { Product } from "../models/product";

export class InMemoryCatalogRepository implements CatalogRepository {
  create(data: Product): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  update(data: Product): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  find(): Promise<[]> {
    throw new Error("Method not implemented.");
  }

  findOne(id: number): Promise<Product> {
    throw new Error("Method not implemented.");
  }
}
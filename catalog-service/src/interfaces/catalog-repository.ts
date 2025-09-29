import { Product } from "~/models/product";

export interface CatalogRepository {
  create(data: Product): Promise<Product>;
  update(data: Product): Promise<Product>;
  delete(id: number): Promise<number>;
  find(limit: number, offset: number): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
  findStock(ids: number[]): Promise<Product[]>;
}
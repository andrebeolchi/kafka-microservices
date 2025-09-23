import { Product } from "../models/product";

export interface CatalogRepository {
  create(data: Product): Promise<Product>;
  update(data: Product): Promise<Product>;
  delete(id: number): Promise<void>;
  find(): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
}
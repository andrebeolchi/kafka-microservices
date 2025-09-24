import { CatalogRepository } from "~/interfaces/catalog-repository";
import { Product } from "~/models/product";
import { productFactory } from "~/utils/fixtures";

export class PrismaCatalogRepository implements CatalogRepository {
  async create(data: Product): Promise<Product> {
    const product = productFactory.build(data);
    return product;
  }

  async update(data: Product): Promise<Product> {
    const product = productFactory.build(data);
    return product;
  }

  async delete(id: number): Promise<number> {
    const product = productFactory.build({ id });
    return product.id!;
  }

  async find(limit: number, _offset: number): Promise<Product[]> {
    const products = productFactory.buildList(limit);
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = productFactory.build({ id });
    return product;
  }
}
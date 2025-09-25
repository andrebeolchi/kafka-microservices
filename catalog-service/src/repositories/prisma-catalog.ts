import { PrismaClient } from "@prisma/client";
import { CatalogRepository } from "~/interfaces/catalog-repository";
import { Product } from "~/models/product";
import { NotFoundError } from "~/utils/error/errors";

export class PrismaCatalogRepository implements CatalogRepository {
  _prisma: PrismaClient

  constructor() {
    this._prisma = new PrismaClient();
  }

  async create(data: Product): Promise<Product> {
    return this._prisma.product.create({ data })
  }

  async update({ id, ...data }: Product): Promise<Product> {
    return this._prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<number> {
    await this._prisma.product.delete({ where: { id } });
    return id;
  }

  async find(limit: number, offset: number): Promise<Product[]> {
    return this._prisma.product.findMany({ take: limit, skip: offset });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this._prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      throw new NotFoundError('product not found');
    }

    return product;
  }
}
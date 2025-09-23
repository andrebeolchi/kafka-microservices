import { CatalogRepository } from "../interfaces/catalog-repository";

export class CatalogService {
  constructor(
    private _repository: CatalogRepository
  ) { }

  createProduct(input: any) { }

  updateProduct(input: any) { }

  getProducts(limit: number, offset: number) { }

  getProduct(id: number) { }

  deleteProduct(id: number) { }
}
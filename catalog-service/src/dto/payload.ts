import { CreateProductRequest } from "./product"

export type CatalogProduct = { id: number } & Partial<CreateProductRequest>
import { faker } from '@faker-js/faker'

import { Product } from "~/models/product"

import { CatalogRepository } from "~/interfaces/catalog-repository"

import { MockCatalogRepository } from "~/repositories/mock-catalog"

import { CatalogService } from "./catalog"

import { Factory } from "rosie"

const productFactory = new Factory<Product>().attrs({
  id: () => faker.number.int({ min: 1, max: 1000 }),
  name: () => faker.commerce.productName(),
  description: () => faker.commerce.productDescription(),
  price: () => +faker.commerce.price(),
  stock: () => faker.number.int({ min: 10, max: 1000 }),
})

describe("[services] catalog", () => {
  let repository: CatalogRepository

  beforeEach(() => {
    repository = new MockCatalogRepository()
  })

  afterEach(() => {
    repository = {} as CatalogRepository
  })

  describe("create product", () => {
    it("should create a product", async () => {
      const service = new CatalogService(repository)

      const body = productFactory.build()

      const result = await service.createProduct(body)

      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      })
    })

    it("should throw an error if product creation fails", async () => {
      const service = new CatalogService(repository)

      const body = productFactory.build()

      jest.spyOn(repository, "create").mockImplementationOnce(() => Promise.resolve({} as Product))

      await expect(service.createProduct(body)).rejects.toThrow("unable to create product")
    })

    it("should throw an error if product already exists", async () => {
      const service = new CatalogService(repository)

      const body = productFactory.build()

      jest.spyOn(repository, "create").mockRejectedValueOnce(new Error("product already exists"))

      await expect(service.createProduct(body)).rejects.toThrow("product already exists")
    })
  })

  describe("update product", () => {
    it("should update a product", async () => {
      const service = new CatalogService(repository)

      const body = productFactory.build()

      const update = await service.updateProduct(body)

      expect(update).toMatchObject(body)
    })

    it("should throw an error if product does not exist", async () => {
      const service = new CatalogService(repository)

      jest.spyOn(repository, "update").mockRejectedValueOnce(new Error("product does not exist"))

      await expect(service.updateProduct({})).rejects.toThrow("product does not exist")
    })
  })

  describe("get products", () => {
    it("should get products by limit and offset", async () => {
      const service = new CatalogService(repository)

      const limit = faker.number.int({ min: 10, max: 50 })
      const products = productFactory.buildList(limit)

      jest.spyOn(repository, "find").mockImplementationOnce(async () => products)

      const result = await service.getProducts(limit, 0)

      expect(result.length).toBeLessThanOrEqual(limit)
      expect(result).toMatchObject(products)
    })

    it("should throw an error if products does not exist", async () => {
      const service = new CatalogService(repository)

      jest.spyOn(repository, "find").mockRejectedValueOnce(new Error("products does not exist"))

      await expect(service.getProducts(0, 0)).rejects.toThrow("products does not exist")
    })
  })

  describe("get product", () => {
    it("should get product by id", async () => {
      const service = new CatalogService(repository)
      const product = productFactory.build()

      jest.spyOn(repository, "findOne").mockImplementationOnce(async () => product)

      const result = await service.getProduct(product.id!)

      expect(result).toMatchObject(product)
    })

    it("should throw an error if product does not exist", async () => {
      const service = new CatalogService(repository)

      jest.spyOn(repository, "findOne").mockRejectedValueOnce(new Error("product does not exist"))

      await expect(service.getProduct(0)).rejects.toThrow("product does not exist")
    })
  })

  describe("delete product", () => {
    it("should delete product by id", () => {
      const service = new CatalogService(repository)
      const product = productFactory.build()

      jest.spyOn(repository, "delete").mockImplementationOnce(async () => product.id!)

      const result = service.deleteProduct(product.id!)

      expect(result).resolves.toBe(product.id)
    })

    it("should throw an error if product does not exist", async () => {
      const service = new CatalogService(repository)

      jest.spyOn(repository, "delete").mockRejectedValueOnce(new Error("product does not exist"))

      await expect(service.deleteProduct(0)).rejects.toThrow("product does not exist")
    })
  })
})
import request from "supertest"
import express from "express"
import { faker } from "@faker-js/faker"
import { router as catalogRoutes, catalogService } from "./catalog-routes"
import { productFactory } from "~/utils/fixtures"

const app = express()
app.use(express.json())
app.use(catalogRoutes)

const mockRequest = (rest?: any) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  stock: faker.number.int({ min: 10, max: 100 }),
  price: +faker.commerce.price(),
  ...rest,
})

describe("[api] catalog routes", () => {
  describe("[POST] /products", () => {
    it("[201] should create a new product", async () => {
      const body = mockRequest()
      const product = productFactory.build()

      jest
        .spyOn(catalogService, "createProduct")
        .mockResolvedValueOnce(product)

      const response = await request(app)
        .post("/products")
        .send(body)
        .set("Accept", "application/json")

      expect(response.status).toBe(201)
      expect(response.body).toEqual(product)
    })

    it("[400] should response with validation error", async () => {
      const body = mockRequest()

      const response = await request(app)
        .post("/products")
        .send({ ...body, name: "" })
        .set("Accept", "application/json")

      expect(response.status).toBe(400)
      expect(response.body).toEqual("name should not be empty")
    })

    it("[500] should response with an internal server error", async () => {
      const body = mockRequest()

      jest
        .spyOn(catalogService, "createProduct")
        .mockRejectedValueOnce(new Error("unable to create product"))

      const response = await request(app)
        .post("/products")
        .send(body)
        .set("Accept", "application/json")

      expect(response.status).toBe(500)
      expect(response.body).toEqual("unable to create product")
    })
  })

  describe("[PATCH] /products/:id", () => {
    it("[200] should update an existing product", async () => {
      const product = productFactory.build()
      const body = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      }

      jest
        .spyOn(catalogService, "updateProduct")
        .mockResolvedValueOnce(product)

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(body)
        .set("Accept", "application/json")

      expect(response.status).toBe(200)
      expect(response.body).toEqual(product)
    })

    it("[400] should response with validation error", async () => {
      const product = productFactory.build()
      const body = {
        name: product.name,
        price: -1,
        stock: product.stock,
      }

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(body)
        .set("Accept", "application/json")

      expect(response.status).toBe(400)
      expect(response.body).toEqual("price must be a positive number")
    })

    it("[500] should response with an internal server error", async () => {
      const product = productFactory.build()
      const body = mockRequest()

      jest
        .spyOn(catalogService, "updateProduct")
        .mockRejectedValueOnce(new Error("unable to update product"))

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(body)
        .set("Accept", "application/json")

      expect(response.status).toBe(500)
      expect(response.body).toEqual("unable to update product")
    })
  })

  describe("[GET] /products?limit=0&offset=0", () => {
    it("[200] should return a list of products based on limit and offset", async () => {
      const limit = faker.number.int({ min: 10, max: 50 })
      const products = productFactory.buildList(limit)

      jest
        .spyOn(catalogService, "getProducts")
        .mockResolvedValueOnce(products)

      const response = await request(app)
        .get(`/products?limit=${limit}&offset=0`)
        .set("Accept", "application/json")

      expect(response.status).toBe(200)
      expect(response.body).toEqual(products)
    })

    it("[500] should response with an internal server error", async () => {
      const limit = faker.number.int({ min: 10, max: 50 })

      jest
        .spyOn(catalogService, "getProducts")
        .mockRejectedValueOnce(new Error("unable to fetch products"))

      const response = await request(app)
        .get(`/products?limit=${limit}&offset=0`)
        .set("Accept", "application/json")

      expect(response.status).toBe(500)
      expect(response.body).toEqual("unable to fetch products")
    })
  })

  describe("[GET] /products/:id", () => {
    it("[200] should return a product by id", async () => {
      const product = productFactory.build()

      jest
        .spyOn(catalogService, "getProduct")
        .mockResolvedValueOnce(product)

      const response = await request(app)
        .get(`/products/${product.id}`)
        .set("Accept", "application/json")

      expect(response.status).toBe(200)
      expect(response.body).toEqual(product)
    })

    it("[404] should response with not found when product does not exist", async () => {
      const id = faker.number.int({ min: 1, max: 1000 })

      jest
        .spyOn(catalogService, "getProduct")
        .mockRejectedValueOnce(new Error("product does not exist"))

      const response = await request(app)
        .get(`/products/${id}`)
        .set("Accept", "application/json")

      expect(response.status).toBe(404)
      expect(response.body).toEqual("product does not exist")
    })

    it("[500] should response with an internal server error", async () => {
      const id = faker.number.int({ min: 1, max: 1000 })

      jest
        .spyOn(catalogService, "getProduct")
        .mockRejectedValueOnce(new Error("unable to fetch product"))

      const response = await request(app)
        .get(`/products/${id}`)
        .set("Accept", "application/json")

      expect(response.status).toBe(500)
      expect(response.body).toEqual("unable to fetch product")
    })
  })

  describe("[DELETE] /products/:id", () => {
    it("[200] should delete a product by id", async () => {
      const product = productFactory.build()

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockResolvedValueOnce({ id: product.id! })

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set("Accept", "application/json")

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ id: product.id! })
    })

    it("[404] should response with not found when product does not exist", async () => {
      const id = faker.number.int({ min: 1, max: 1000 })

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockRejectedValueOnce(new Error("product does not exist"))

      const response = await request(app)
        .delete(`/products/${id}`)
        .set("Accept", "application/json")

      expect(response.status).toBe(404)
      expect(response.body).toEqual("product does not exist")
    })

    it("[500] should response with an internal server error", async () => {
      const id = faker.number.int({ min: 1, max: 1000 })

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockRejectedValueOnce(new Error("unable to delete product"))

      const response = await request(app)
        .delete(`/products/${id}`)
        .set("Accept", "application/json")

      expect(response.status).toBe(500)
      expect(response.body).toEqual("unable to delete product")
    })
  })
})
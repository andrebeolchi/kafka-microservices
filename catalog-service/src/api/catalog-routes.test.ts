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
        .mockRejectedValueOnce(new Error("error occurred on create product"))

      const response = await request(app)
        .post("/products")
        .send(body)
        .set("Accept", "application/json")

      expect(response.status).toBe(500)
      expect(response.body).toEqual("error occurred on create product")
    })
  })
})
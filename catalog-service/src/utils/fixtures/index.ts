import { Factory } from 'rosie'
import { faker } from '@faker-js/faker'
import { Product } from '~/models/product'

export const productFactory = new Factory<Product>().attrs({
  id: () => faker.number.int({ min: 1, max: 1000 }),
  name: () => faker.commerce.productName(),
  description: () => faker.commerce.productDescription(),
  price: () => +faker.commerce.price(),
  stock: () => faker.number.int({ min: 10, max: 1000 }),
})
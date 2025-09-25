import { CartRequestInput } from "~/dto/cart-request"
import type { CartRepositoryType } from "~/types/repository"
import { GetProductDetails } from "~/utils/broker"
import { NotFoundError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"

export const CreateCart = async (input: CartRequestInput, repository: CartRepositoryType) => {
  const product = await GetProductDetails(input.productId)
  logger.info(product)

  if (product.stock < input.quantity) {
    throw new NotFoundError("insufficient stock")
  }

  // const data = await repository.create(input)
  return product
}

export const GetCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.find(input)
  return data
}

export const EditCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.update(input)
  return data
}

export const DeleteCart = async (input: any, repository: CartRepositoryType) => {
  const data = await repository.delete(input)
  return data
}
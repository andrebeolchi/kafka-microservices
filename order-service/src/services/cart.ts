import { CartLineItem } from "~/db/schema"
import { CartEditRequestInput, CartRequestInput } from "~/dto/cart-request"
import { CartRepositoryType } from "~/repositories/cart"
import { GetProductDetails } from "~/utils/broker"
import { NotFoundError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"

export const CreateCart = async (input: CartRequestInput, repository: CartRepositoryType) => {
  const product = await GetProductDetails(input.productId)
  logger.info(product)

  if (product.stock < input.quantity) {
    throw new NotFoundError("insufficient stock")
  }

  return await repository.createCart(input.customerId, {
    productId: input.productId,
    price: `${product.price}`,
    itemName: product.name,
    variant: product.variant,
    quantity: input.quantity,
  } as CartLineItem)
}

export const GetCart = async (id: number, repository: CartRepositoryType) => {
  const data = await repository.findCart(id)

  if (!data) {
    throw new NotFoundError("cart not found")
  }

  return data
}

export const EditCart = async (input: CartEditRequestInput, repository: CartRepositoryType) => {
  const data = await repository.updateCart(input.id, input.quantity)
  return data
}

export const DeleteCart = async (id: number, repository: CartRepositoryType) => {
  const data = await repository.deleteFromCart(id)
  return data
}
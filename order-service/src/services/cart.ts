import { CartLineItem } from "~/db/schema"
import { CartEditRequestInput, CartRequestInput } from "~/dto/cart-request"
import { CartRepositoryType } from "~/repositories/cart"
import { GetProductDetails, GetStockDetails } from "~/utils/broker/api"
import { AuthorizeError, NotFoundError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repository: CartRepositoryType
) => {
  const product = await GetProductDetails(input.productId)
  logger.info(product)

  if (product.stock < input.quantity) {
    throw new NotFoundError("insufficient stock")
  }

  const lineItem = await repository.findCartByProductId(input.customerId, input.productId)

  if (lineItem) {
    return repository.updateCart(lineItem.id, lineItem.quantity + input.quantity)
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
  const cart = await repository.findCart(id)

  if (!cart) {
    throw new NotFoundError("cart does not exist")
  }

  const lineItems = cart.lineItems

  if (!lineItems.length) {
    throw new NotFoundError("cart items not found")
  }

  const productIds = lineItems.map((item) => item.productId)
  const stockDetails = await GetStockDetails(productIds)

  //NOTE - this nested loop should not be an issue, usually cart items will be less than 100
  if (Array.isArray(stockDetails)) {
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find((stock) => stock.id === lineItem.productId)
      if (stockItem) {
        lineItem.price = `${stockItem.price}`
        lineItem.itemName = stockItem.name
        lineItem.availability = stockItem.stock
      }
    })

    cart.lineItems = lineItems
  }

  return cart
}

const AuthorizedCart = async (
  lineItemId: number,
  customerId: number,
  repository: CartRepositoryType
) => {
  const cart = await repository.findCart(customerId)
  if (!cart) {
    throw new NotFoundError("cart does not exist")
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId)
  if (!lineItem) {
    throw new AuthorizeError("you are not authorized to edit this item")
  }

  return lineItem
}

export const EditCart = async (
  input: CartEditRequestInput & { customerId: number },
  repository: CartRepositoryType
) => {
  await AuthorizedCart(input.id, input.customerId, repository)
  const data = await repository.updateCart(input.id, input.quantity)
  return data
}

export const DeleteCart = async (input: { id: number, customerId: number }, repository: CartRepositoryType) => {
  await AuthorizedCart(input.id, input.customerId, repository)
  const data = await repository.deleteFromCart(input.id)
  return data
}
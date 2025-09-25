import { db } from "~/db/db-connection";
import { carts } from "~/db/schema";
import { CartRequestInput } from "~/dto/cart-request";
import type { CartRepositoryType } from "~/types/repository";

const createCart = async (input: CartRequestInput): Promise<{}> => {
  const result = await db
     .insert(carts)
    .values({
      customerId: input.customerId,
    })
    .returning({
      cardId: carts.id
    })

  return {
    message: "created cart from repository",
    input
  }
}
const findCart = async (input: any): Promise<{}> => {
  return { message: "fetched cart from repository" }
}
const updateCart = async (input: any): Promise<{}> => {
  return { message: "updated cart from repository" }
}
const deleteCart = async (input: any): Promise<{}> => {
  return { message: "deleted cart from repository" }
}

export const CartRepository: CartRepositoryType = {
  create: createCart,
  find: findCart,
  update: updateCart,
  delete: deleteCart
}
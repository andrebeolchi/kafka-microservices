import type { CartRepositoryType } from "~/types/repository";

const createCart = async (input: any): Promise<{}> => {
  // connect to db
  // perform db operations
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
import { CartRepositoryType } from "~/repositories/cart";
import { OrderRepositoryType } from "~/repositories/order";

export const CreateOrder = async (
  userId: number,
  orderRepository: OrderRepositoryType,
  cartRepository: CartRepositoryType
) => {
  return {}
}

export const UpdateOrder = async (
  input: { orderId: number, status: string },
  orderRepository: OrderRepositoryType
) => {
  return {}
}

export const GetOrder = async (input: { orderId: number, customerId: number }, orderRepository: OrderRepositoryType) => { }

export const GetOrdersByCustomerId = async (
  customerId: number,
  orderRepository: OrderRepositoryType
) => {
  return {}
}

export const DeleteOrder = async (orderId: number, orderRepository: OrderRepositoryType) => {
  return {}
}

export const HandleSubscription = async (message: any) => {
  // if message.type === 'order.updated' 
  // call update order

  return {}
}
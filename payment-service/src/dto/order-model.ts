import { OrderStatus } from "~/types/order"

export interface InProcessOrder {
  id?: number // order id
  orderNumber: number
  status: OrderStatus
  customerId: number
  amount: number // in cents
  createdAt?: Date
  updatedAt?: Date
}
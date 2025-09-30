import { OrderStatus } from "~/types/order"

export interface OrderLineItem {
  id: number
  productId: number
  itemName: string
  quantity: number
  price: number
  orderId: number
  createdAt: Date
  updatedAt: Date
}

export interface OrderWithLineItems {
  id?: number
  customerId: number
  orderNumber: number
  transactionId: string | null
  amount: string
  status: string
  orderItems: OrderLineItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface InProcessOrder {
  id?: number // order id
  orderNumber: number
  status: OrderStatus
  customerId: number
  amount: number // in cents
  createdAt?: Date
  updatedAt?: Date
}
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
  orderId: number
  transactionId: string | null
  amount: string
  status: string
  orderItems: OrderLineItem[]
  createdAt?: Date
  updatedAt?: Date
}
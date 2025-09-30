export interface OrderLineItem {
  id: number
  productId: number
  quantity: number
}

export interface OrderWithLineItems {
  id?: number
  orderNumber: number
  orderItems: OrderLineItem[]
}
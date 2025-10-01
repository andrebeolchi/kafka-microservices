import { InProcessOrder, OrderLineItem, OrderWithLineItems } from "~/dto/order-request";
import { CartRepositoryType } from "~/repositories/cart";
import { OrderRepositoryType } from "~/repositories/order";
import { OrderStatus } from "~/types/order";
import { MessageType } from "~/types/subscription";
import { sendCreateOrderMessage } from "./broker";
import { NotFoundError } from "~/utils/error/errors";

export const CreateOrder = async (
  customerId: number,
  orderRepository: OrderRepositoryType,
  cartRepository: CartRepositoryType
) => {
  const cart = await cartRepository.findCart(customerId)

  if (!cart) {
    throw new Error('Cart not found')
  }

  let cartTotal = 0
  let orderLineItems: OrderLineItem[] = []

  cart.lineItems.forEach(item => {
    cartTotal += +item.price * item.quantity
    orderLineItems.push({
      productId: item.productId,
      itemName: item.itemName,
      quantity: item.quantity,
      price: +item.price
    } as OrderLineItem)
  })

  const orderNumber = Math.floor(Math.random() * 1000000)

  const orderInput: OrderWithLineItems = {
    orderNumber,
    transactionId: null, //TODO: payment id from payment service
    status: OrderStatus.PENDING, // payment status will decide the order status
    customerId,
    amount: cartTotal.toString(),
    orderItems: orderLineItems,
  }

  const orderId = await orderRepository.createOrder(orderInput)
  await cartRepository.clearCartData(customerId)

  await sendCreateOrderMessage({ ...orderInput, id: orderId })

  return { message: 'Order created successfully', orderNumber }
}

export const UpdateOrder = async (
  input: { orderId: number, status: OrderStatus },
  orderRepository: OrderRepositoryType
) => {
  const order = await orderRepository.updateOrder(input.orderId, input.status)

  //TODO: fire a message to subscription service [catalog service] to update stock
  if (input.status === OrderStatus.CANCELLED) {
    // await orderRepository.publishOrderEvent(order, "ORDER_CANCELLED")
  }

  return { message: 'Order updated successfully' }
}

export const GetOrder = async (input: { orderId: number, customerId: number }, orderRepository: OrderRepositoryType) => {
  const order = await orderRepository.findOrder(input.orderId)

  if (!order || order.customerId !== input.customerId) {
    throw new Error('Order not found')
  }

  return order
}

export const GetOrdersByCustomerId = async (
  customerId: number,
  orderRepository: OrderRepositoryType
) => {
  const orders = await orderRepository.findOrdersByCustomerId(customerId)

  if (!orders.length) {
    throw new Error('Orders not found')
  }

  return orders
}

export const DeleteOrder = async (orderId: number, orderRepository: OrderRepositoryType) => {
  await orderRepository.deleteOrder(orderId)
  return true
}

export const HandleSubscription = async (message: MessageType): Promise<void> => {
  console.info('Received message by order kafka consumer ', message)
  // if message.type === 'order.updated' 
  // call update order
}

export const CheckoutOrder = async (orderNumber: number, orderRepository: OrderRepositoryType) => {
  const order = await orderRepository.findOrderByOrderNumber(orderNumber)

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  const checkoutOrder: InProcessOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status as OrderStatus,
    customerId: order.customerId,
    amount: +order.amount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }

  return checkoutOrder
}

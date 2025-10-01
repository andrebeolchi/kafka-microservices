import { GetOrderDetails } from "~/utils/broker/api"
import { AuthorizeError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"
import { PaymentGateway } from "~/utils/payment/types"
import { sendPaymentUpdateMessage } from "./broker"

interface CreatePaymentRequest {
  userId: number
  orderNumber: number
  paymentGateway: PaymentGateway
}

export const CreatePayment = async ({ userId, orderNumber, paymentGateway }: CreatePaymentRequest) => {
  const order = await GetOrderDetails(orderNumber)

  if (order.customerId !== userId) {
    logger.warn(`User ${userId} is not authorized to create payment for order ${orderNumber}`)
    throw new AuthorizeError('User not authorized to create payment')
  }

  const amount = order.amount
  const metadata = { orderNumber: +order.orderNumber!, userId }

  const paymentResponse = await paymentGateway.createPayment(amount, metadata)

  return {
    id: paymentResponse.id,
    secret: paymentResponse.secret,
    publicKey: paymentResponse.publicKey,
    amount,
  }
}

interface VerifyPaymentRequest {
  paymentId: string
  paymentGateway: PaymentGateway
}

export const VerifyPayment = async ({ paymentId, paymentGateway }: VerifyPaymentRequest) => {
  const { status, orderNumber, paymentLog } = await paymentGateway.getPayment(paymentId)

  const response = await sendPaymentUpdateMessage({
    status,
    orderNumber,
    paymentLog,
  })

  logger.info(response, 'Payment update message sent')

  return {
    message: "Payment verified",
    status,
    orderNumber,
    paymentLog,
  }
}
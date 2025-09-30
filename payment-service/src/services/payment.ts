import { GetOrderDetails } from "~/utils/broker/api"
import { AuthorizeError } from "~/utils/error/errors"

interface CreatePaymentRequest {
  userId: number
  orderNumber: number
  paymentGateway: unknown
}

export const CreatePayment = async ({ userId, orderNumber, paymentGateway }: CreatePaymentRequest) => {
  // get order details from order service
  const order = await GetOrderDetails(orderNumber)
  
  if (order.customerId !== userId) {
    throw new AuthorizeError('User not authorized to create payment')
  }

  

  // create a new payment record

  // call payment gateway to process payment

  // return payment details
  return {
    secret: 'my_secret_key',
    publicKey: 'my_public_key',
    amount: 1000, // has to be fetched from order service
  }
}

interface VerifyPaymentRequest {
  paymentId: string
  paymentGateway: unknown
}

export const VerifyPayment = async ({ paymentId, paymentGateway }: VerifyPaymentRequest) => {
  // call payment gateway to verify payment

  // update payment record in database using message broker

  // return payment status
}
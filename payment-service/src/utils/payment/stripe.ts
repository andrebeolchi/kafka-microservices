import Stripe from "stripe";
import { GetPaymentResponse, PaymentGateway } from "./types";
import { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY } from "~/config";
import { logger } from "../logger";

const stripe = new Stripe(STRIPE_SECRET_KEY)

const createPayment = async (amount: number, metadata: Record<string, any>) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'brl',
    metadata,
  })

  logger.debug(paymentIntent, 'stripe payment intent')

  return {
    id: paymentIntent.id,
    secret: paymentIntent.client_secret!,
    publicKey: STRIPE_PUBLIC_KEY,
    amount: paymentIntent.amount,
  }
}

const getPayment = async (paymentId: string): Promise<GetPaymentResponse> => {
  const paymentResponse = await stripe.paymentIntents.retrieve(paymentId, {})
  
  logger.debug(paymentResponse, 'stripe payment response')

  const orderNumber = +paymentResponse.metadata.orderNumber

  return { status: paymentResponse.status, orderNumber, paymentLog: { ...paymentResponse } }
}

export const StripePayment: PaymentGateway = {
  createPayment,
  getPayment,
}
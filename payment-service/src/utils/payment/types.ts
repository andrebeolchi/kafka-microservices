export interface CreatePaymentMetadata {
  orderNumber: number
  userId: number
}

export interface CreatePaymentResponse {
  id: string
  secret: string
  publicKey: string
  amount: number
}

export interface GetPaymentResponse {
  status: string
  orderNumber: number
  paymentLog: Record<string, unknown>
}

export interface PaymentGateway {
  createPayment(amount: number, metadata: CreatePaymentMetadata): Promise<CreatePaymentResponse>
  getPayment(paymentId: string): Promise<GetPaymentResponse>
}


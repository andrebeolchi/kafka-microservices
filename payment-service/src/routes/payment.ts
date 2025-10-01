import express, { NextFunction, Request, Response } from 'express';
import { requestAuthorizer } from './middleware';
import { NotFoundError, ValidationError } from '~/utils/error/errors';
import { CreatePayment, VerifyPayment } from '~/services/payment';
import { PaymentGateway } from '~/utils/payment/types';
import { StripePayment } from '~/utils/payment/stripe';

const router = express.Router();
const paymentGateway: PaymentGateway = StripePayment

router.post('/create-payment', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user

    if (!user) {
      next(new NotFoundError('User not found'));
      return
    }

    const response = await CreatePayment({
      orderNumber: +req.body.orderNumber,
      userId: user.id,
      paymentGateway
    })

    res.status(200).send({ message: 'Payment created successfully', data: response });
  } catch (error) {
    next(error)
  }
});

router.get('/verify-payment/:id', requestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user

    if (!user) {
      next(new NotFoundError('User not found'));
      return
    }

    const paymentId = req.params.id

    if (!paymentId) {
      next(new ValidationError('Payment ID is required'));
      return
    }

    const response = await VerifyPayment({
      paymentId,
      paymentGateway,
    })

    res.status(200).send(response);
  } catch (error) {
    next(error)
  }
});

export { router }
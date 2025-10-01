import axios from "axios"
import { ORDER_BASE_URL, USER_BASE_URL } from "~/config"
import { InProcessOrder } from "~/dto/order-model"
import { User } from "~/dto/user-model"
import { AuthorizeError, NotFoundError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"

const fetch = axios.create()

const setAuthorizationHeader = (token: string) => {
  logger.debug(`setting authorization header for token ${token}`)
  fetch.defaults.headers.common['Authorization'] = token
}

export const GetOrderDetails = async (orderNumber: number): Promise<InProcessOrder> => {
  try {
    logger.debug(`fetching order details for orderNumber: ${orderNumber}`)
    const { data } = await fetch.get<InProcessOrder>(`${ORDER_BASE_URL}/orders/${orderNumber}/checkout`)
    return data
  } catch (error) {
    logger.error(error)
    throw new NotFoundError("order not found")
  }
}

export const ValidateUser = async (token: string): Promise<User> => {
  try {
    setAuthorizationHeader(token)
    const { data, status } = await fetch.get<User>(`${USER_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: token
      }
    })

    if (status !== 200) {
      throw new AuthorizeError("user not authorized")
    }

    return data
  } catch (error) {
    logger.error(error)
    throw new AuthorizeError("user not authorized")
  }
}
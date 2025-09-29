import axios from "axios"
import { CATALOG_BASE_URL, USER_BASE_URL } from "~/config"
import { Product } from "~/dto/product"
import { User } from "~/dto/user-model"
import { AuthorizeError, NotFoundError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"

export const GetProductDetails = async (id: number): Promise<Product> => {
  try {
    logger.info(`fetching product details for id: ${id}`)
    const { data } = await axios.get<Product>(`${CATALOG_BASE_URL}/products/${id}`)
    return data
  } catch (error) {
    logger.error(error)
    throw new NotFoundError("product not found")
  }
}

export const GetStockDetails = async (ids: number[]): Promise<Product[]> => {
  try {
    const { data } = await axios.post<Product[]>(`${CATALOG_BASE_URL}/products/stock`, { ids })
    return data as Product[]
  } catch (error) {
    logger.error(error)
    throw new NotFoundError("error fetching stock details")
  }
}

export const ValidateUser = async (token: string): Promise<User> => {
  try {
    const { status, data } = await axios.get<User>(`${USER_BASE_URL}/validate`, {
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
import axios from "axios"
import { CATALOG_BASE_URL } from "~/config"
import { Product } from "~/dto/product"
import { NotFoundError } from "~/utils/error/errors"
import { logger } from "~/utils/logger"

export const GetProductDetails = async (id: number) => {
  try {
    logger.info(`fetching product details for id: ${id}`)
    const { data } = await axios.get<Product>(`${CATALOG_BASE_URL}/products/${id}`)
    return data
  } catch (error) {
    logger.error(error)
    throw new NotFoundError("product not found")
  }
}
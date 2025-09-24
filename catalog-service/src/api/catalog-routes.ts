import { NextFunction, Request, Response, Router } from 'express'
import { CreateProductRequest } from '~/dto/product'
import { PrismaCatalogRepository } from '~/repositories/prisma-catalog'
import { CatalogService } from '~/services/catalog'
import { RequestValidator } from '~/utils/request-validator'

const router = Router()

const catalogRepository = new PrismaCatalogRepository()
export const catalogService = new CatalogService(catalogRepository)

// endpoints
router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { errors, input } = await RequestValidator(CreateProductRequest, req.body)
  
    if (errors) {
      return res.status(400).json(errors)
    }
  
    const data = await catalogService.createProduct(req.body)
  
    return res.status(201).json(data)
  } catch (error) {
    const err = error as Error
    return res.status(500).json(err.message)
  }

})

export { router }
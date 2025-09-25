import { NextFunction, Request, Response, Router } from 'express'
import { CreateProductRequest, UpdateProductRequest } from '~/dto/product'
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

router.patch('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id) || 0

  try {
    const { errors, input } = await RequestValidator(UpdateProductRequest, req.body)

    if (errors) {
      return res.status(400).json(errors)
    }

    const data = await catalogService.updateProduct({ id, ...input })

    return res.status(200).json(data)
  } catch (error) {
    const err = error as Error
    return res.status(500).json(err.message)
  }
})

router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  const limit = Number(req.query['limit']) || 10
  const offset = Number(req.query['offset']) || 0

  try {
    const data = await catalogService.getProducts(limit, offset)

    return res.status(200).json(data)
  } catch (error) {
    const err = error as Error
    return res.status(500).json(err.message)
  }
})

router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id) || 0

  try {
    const data = await catalogService.getProduct(id)

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
})

router.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id) || 0

  try {
    const data = await catalogService.deleteProduct(id)

    return res.status(200).json(data)
  } catch (error) {
    const err = error as Error

    if (err.message.includes('not exist')) {
      return res.status(404).json(err.message)
    }

    return res.status(500).json(err.message)
  }
})

export { router }
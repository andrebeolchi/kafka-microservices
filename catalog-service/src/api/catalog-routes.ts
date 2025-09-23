import { NextFunction, Request, Response, Router } from 'express'

const router = Router()

// endpoints
router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  return res.status(201).json({})
})

export { router }
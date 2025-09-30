import { NextFunction, Request, Response } from "express"
import { ValidateUser } from "~/utils/broker/api"
import { logger } from "~/utils/logger"

export const requestAuthorizer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      logger.error("Unauthorized access attempt due to missing token.")
      return res.status(403).json({ message: "Unauthorized due to missing token" })
    }

    const authHeader = req.headers.authorization as string

    const data = await ValidateUser(authHeader)

    req.user = data

    next()
  } catch (error) {
    logger.error("Unauthorized access attempt.")
    return res.status(403).json({ error })
  }
}
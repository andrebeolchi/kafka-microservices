import { app as expressApp } from "./express-app"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 3001

export const startServer = async () => {
  expressApp.listen(PORT, () => {
    logger.info(`Order service listening on port ${PORT}`)
  })

  process.on("uncaughtException", async (error) => {
    logger.error(error)
    process.exit(1)
  })
}

startServer().then(() => {
  logger.info("Server started successfully")
})
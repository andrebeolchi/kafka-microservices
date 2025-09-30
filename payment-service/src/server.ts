import { APP_PORT } from "./config"
import { expressApp } from "./express-app"
import { logger } from "./utils/logger"

export const startServer = async () => {
  const app = await expressApp()

  app.listen(APP_PORT, () => {
    logger.info(`Payment service listening on port ${APP_PORT}`)
  })

  process.on("uncaughtException", async (error) => {
    logger.error(error)
    process.exit(1)
  })
}

startServer().then(() => {
  logger.info("Server started successfully")
})
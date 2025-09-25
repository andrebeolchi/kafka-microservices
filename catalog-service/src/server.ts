import { app as expressApp } from "./express-app"
import { logger } from "./utils/logger"

const PORT = process.env.PORT || 3000

export const startServer = async () => {
  expressApp.listen(PORT, () => {
    logger.info(`Catalog service listening on port ${PORT}`)
  })

  process.on("uncaughtException", async (err) => {
    logger.error(err)
    process.exit(1)
  })
}

startServer().then(() => {
  logger.info("Server started successfully")
})
import { app as expressApp } from "./express-app"

const PORT = process.env.PORT || 3001

export const startServer = async () => {
  expressApp.listen(PORT, () => {
    console.log(`Order service listening on port ${PORT}`)
  })

  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err)
    process.exit(1)
  })
}

startServer().then(() => {
  console.log("Server started successfully")
})
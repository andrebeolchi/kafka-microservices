import express from 'express'
import { router as catalogRoutes } from './api/catalog-routes'

const app = express()
app.use(express.json())

app.use(catalogRoutes)

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

export { app }
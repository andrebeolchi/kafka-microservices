import express from 'express'
import { router as catalogRoutes } from './api/catalog-routes'
import { HandleErrorWithLogger } from './utils/error/handler'
import { httpLogger } from './utils/logger'
import cors from 'cors'
import { ElasticSearchService } from './services/elastic-search'
import { ElasticSearchEventListener } from './utils/elastic-search-event-listener'

const app = express()
app.use(express.json())
app.use(cors({ origin: '*' }))
app.use(httpLogger)

const elasticSearchService = new ElasticSearchService()
ElasticSearchEventListener.instance.listen(elasticSearchService)

app.use(catalogRoutes)

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

app.use(HandleErrorWithLogger)

export { app }
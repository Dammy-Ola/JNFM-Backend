/**
 * Required External Modules
 */
import * as dotenv from 'dotenv'
import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routes from './api/v1/routes'
import { startApp } from './api/v1/config'
import { errorHandler } from './api/v1/middlewares'

dotenv.config()

/**
 * App Variables
 */
if (!process.env.PORT) {
  process.exit(1)
}

const app: Express = express()

/**
 *  App Configuration
 */
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL as string,
    credentials: true as boolean,
    optionsSuccessStatus: 200 as number,
  })
)
app.use(express.json())
app.use(routes)
app.use(errorHandler)

/**
 * Server Activation
 */
startApp()

import { serve } from '@hono/node-server'
import app from './api/hono'
import { loadEnv } from './utils/get-env'

const { VITE_PORT } = loadEnv()
serve({ fetch: app.fetch, port: Number(VITE_PORT) })

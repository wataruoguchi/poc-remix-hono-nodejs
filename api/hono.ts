import { serveStatic } from '@hono/node-server/serve-static'
import type { AppLoadContext, RequestHandler } from '@remix-run/node'
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { remix } from 'remix-hono/handler'

const app = new Hono()

let handler: RequestHandler | undefined

app.get('/hono', (c) => c.text('Hono'))

app.use(poweredBy())
app.use('/assets/*', serveStatic({ root: './build/client/' }))
app.use('/favicon.ico', serveStatic({ root: './build/client/' }))
app.use(async (c, next) => {
  if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
    const serverBuild = await import('../build/server')

    return remix({
      build: serverBuild,
      mode: 'production',
    })(c, next)
  } else {
    if (!handler) {
      // @ts-expect-error it's not typed
      // eslint-disable-next-line import/no-unresolved
      const build = await import('virtual:remix/server-build')
      const { createRequestHandler } = await import('@remix-run/node')
      handler = createRequestHandler(build, 'development')
    }
    const remixContext = {
      cloudflare: {
        env: c.env,
      },
    } as unknown as AppLoadContext
    return handler(c.req.raw, remixContext)
  }
})

export default app

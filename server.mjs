import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = fileURLToPath(new URL('.', import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 3000)

const requiredFlexVariables = [
  'FLEX_AUTH_BASE_URL',
  'FLEX_API_AUDIENCE',
  'FLEX_ASSET_BASE_URL',
  'FLEX_CLIENT_ID',
  'FLEX_CLIENT_SECRET',
  'FLEX_MERCHANT_CODE',
]

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(body))
}

async function parseJsonResponse(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

function getFlexConfig() {
  const missingVariables = requiredFlexVariables.filter((name) => !process.env[name])
  if (missingVariables.length) {
    throw new Error(`Faltan variables de entorno: ${missingVariables.join(', ')}`)
  }

  return {
    authBaseUrl: process.env.FLEX_AUTH_BASE_URL.replace(/\/$/, ''),
    apiAudience: process.env.FLEX_API_AUDIENCE,
    assetBaseUrl: process.env.FLEX_ASSET_BASE_URL.replace(/\/$/, ''),
    clientId: process.env.FLEX_CLIENT_ID,
    clientSecret: process.env.FLEX_CLIENT_SECRET,
    merchantCode: process.env.FLEX_MERCHANT_CODE,
    tokenScope: process.env.FLEX_TOKEN_SCOPE || 'create:token post:charges offline_access',
    nonceScope: process.env.FLEX_NONCE_SCOPE || 'create:token post:charges',
  }
}

async function requestFlexSession() {
  const config = getFlexConfig()
  const tokenResponse = await fetch(`${config.authBaseUrl}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'authorize',
      grant_type: 'client_credentials',
      audience: config.apiAudience,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: config.tokenScope,
    }),
  })
  const tokenData = await parseJsonResponse(tokenResponse)

  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error('Flex rechazo la solicitud de token', tokenResponse.status, tokenData)
    throw new Error('No se pudo autenticar con Flex')
  }

  const nonceResponse = await fetch(`${config.authBaseUrl}/nonce`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create.nonce',
      audience: config.apiAudience,
      client_id: config.clientId,
      scope: config.nonceScope,
    }),
  })
  const nonceData = await parseJsonResponse(nonceResponse)

  if (!nonceResponse.ok || !nonceData.nonce) {
    console.error('Flex rechazo la solicitud de nonce', nonceResponse.status, nonceData)
    throw new Error('No se pudo crear la sesion Flex')
  }

  return {
    assetBaseUrl: config.assetBaseUrl,
    merchantCode: config.merchantCode,
    nonce: nonceData.nonce,
  }
}

async function handleApi(request, response) {
  if (request.url !== '/api/flex/session') return false

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Metodo no permitido' })
    return true
  }

  if (!String(request.headers['content-type'] || '').startsWith('application/json')) {
    sendJson(response, 415, { error: 'Content-Type no soportado' })
    return true
  }

  try {
    sendJson(response, 200, await requestFlexSession())
  } catch (error) {
    console.error('No se pudo preparar Flex', error)
    sendJson(response, 502, { error: 'No se pudo preparar el pago' })
  }

  return true
}

async function serveProductionFile(request, response) {
  const pathname = new URL(request.url, 'http://localhost').pathname
  const requestedPath = pathname === '/' ? '/index.html' : pathname
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '')
  let filePath = join(rootDirectory, 'dist', safePath)

  try {
    if (!(await stat(filePath)).isFile()) throw new Error('Not a file')
  } catch {
    filePath = join(rootDirectory, 'dist', 'index.html')
  }

  try {
    const content = await readFile(filePath)
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(content)
  } catch {
    sendJson(response, 404, { error: 'Aplicacion no compilada. Ejecuta npm run build.' })
  }
}

let vite
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite')
  vite = await createViteServer({ appType: 'spa', server: { middlewareMode: true } })
}

const server = createServer(async (request, response) => {
  if (await handleApi(request, response)) return

  if (vite) {
    vite.middlewares(request, response, (error) => {
      if (error) sendJson(response, 500, { error: 'Error del servidor de desarrollo' })
    })
    return
  }

  await serveProductionFile(request, response)
})

server.listen(port, () => {
  console.log(`Demo Flex disponible en http://localhost:${port}`)
})

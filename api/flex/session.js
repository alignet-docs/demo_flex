import process from 'node:process'

const requiredVariables = [
  'FLEX_AUTH_BASE_URL',
  'FLEX_API_AUDIENCE',
  'FLEX_ASSET_BASE_URL',
  'FLEX_CLIENT_ID',
  'FLEX_CLIENT_SECRET',
  'FLEX_MERCHANT_CODE',
]

function getCorsHeaders(request) {
  const origin = request.headers.get('origin')
  const allowedOrigins = String(process.env.APP_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return {
    ...(origin && allowedOrigins.includes(origin) ? { 'Access-Control-Allow-Origin': origin } : {}),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  }
}

function json(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: getCorsHeaders(request),
  })
}

async function readJson(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

function getConfig() {
  const missing = requiredVariables.filter((name) => !process.env[name])
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`)

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

export function OPTIONS(request) {
  return new Response(null, { status: 204, headers: getCorsHeaders(request) })
}

export async function POST(request) {
  try {
    const config = getConfig()
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
    const tokenData = await readJson(tokenResponse)

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Flex token request failed with status', tokenResponse.status)
      return json(request, { error: 'No se pudo autenticar con Flex' }, 502)
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
    const nonceData = await readJson(nonceResponse)

    if (!nonceResponse.ok || !nonceData.nonce) {
      console.error('Flex nonce request failed with status', nonceResponse.status)
      return json(request, { error: 'No se pudo crear la sesion Flex' }, 502)
    }

    return json(request, {
      assetBaseUrl: config.assetBaseUrl,
      merchantCode: config.merchantCode,
      nonce: nonceData.nonce,
    })
  } catch (error) {
    console.error('Flex session configuration failed', error instanceof Error ? error.message : error)
    return json(request, { error: 'No se pudo preparar el pago' }, 500)
  }
}

const flexMethodCodes = {
  Tarjeta: 'CARD',
  Yape: 'YAPE',
  QR: 'QR',
  'Pago Efectivo': 'PAGOEFECTIVO',
  Cuotealo: 'CUOTEALO',
  'Transferencia Bancaria': 'BANK_TRANSFER',
}

const currencyCodes = {
  'Soles (PEN)': '604',
  'Dolares (USD)': '840',
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

let flexAssetsPromise

function loadFlexAssets(assetBaseUrl) {
  if (window.FlexPaymentForms) return Promise.resolve()
  if (flexAssetsPromise) return flexAssetsPromise

  const baseUrl = String(assetBaseUrl || '').replace(/\/$/, '')
  if (!baseUrl) return Promise.reject(new Error('Flex no tiene una URL de assets configurada.'))

  flexAssetsPromise = new Promise((resolve, reject) => {
    const stylesheetId = 'flex-payment-forms-styles'
    if (!document.getElementById(stylesheetId)) {
      const stylesheet = document.createElement('link')
      stylesheet.id = stylesheetId
      stylesheet.rel = 'stylesheet'
      stylesheet.href = `${baseUrl}/main-flex-payment-forms.css`
      document.head.appendChild(stylesheet)
    }

    const existingScript = document.querySelector('script[data-flex-payment-forms]')
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Flex.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `${baseUrl}/flex-payment-forms.min.js`
    script.dataset.flexPaymentForms = 'true'
    script.onload = resolve
    script.onerror = () => reject(new Error('No se pudo cargar Flex.'))
    document.head.appendChild(script)
  })

  return flexAssetsPromise
}

function getAmountInMinorUnits(amount) {
  const normalizedAmount = Number.parseFloat(String(amount || '0').replace(',', '.'))
  const safeAmount = Number.isFinite(normalizedAmount) ? normalizedAmount : 0
  return String(Math.round(safeAmount * 100))
}

function getBuyerNameParts(buyerName) {
  const parts = String(buyerName || '').trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || 'Cliente',
    lastName: parts.slice(1).join(' ') || 'Demo',
  }
}

function getBuyerPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  const withoutCountry = digits.startsWith('51') && digits.length > 9 ? digits.slice(2) : digits

  return {
    country_code: '51',
    subscriber: withoutCountry || '999999999',
  }
}

export function createOperationNumber() {
  const timestampPart = String(Date.now()).slice(-10)
  const randomPart = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return `${timestampPart}${randomPart}`
}

export function normalizeOperationNumber(value) {
  const digits = String(value || '').replace(/\D/g, '')
  return digits || String(Date.now())
}

export function getFlexMethodCodes({ layout, enabledMethods, selectedMethod }) {
  const sourceMethods = layout === 'buttons' && enabledMethods.includes(selectedMethod)
    ? [selectedMethod]
    : enabledMethods

  const selectedMethods = sourceMethods
    .map((method) => flexMethodCodes[method])
    .filter(Boolean)

  return selectedMethods.length ? selectedMethods : ['CARD']
}

export async function createFlexSession() {
  const apiBaseUrl = String(import.meta.env.VITE_FLEX_API_BASE_URL || '').replace(/\/$/, '')
  const response = await fetch(`${apiBaseUrl}/api/flex/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await parseJsonResponse(response)

  if (!response.ok || !data.nonce || !data.merchantCode) {
    console.error('Error preparando la sesion Flex', data)
    throw new Error(data.error || 'No se pudo preparar la sesion Flex')
  }

  await loadFlexAssets(data.assetBaseUrl)

  return { nonce: data.nonce, merchantCode: data.merchantCode }
}

export function buildFlexPayload({
  amount,
  buyerEmail,
  buyerName,
  commerceCode,
  companyName,
  currency,
  merchantCode,
  operationNumber,
  phone,
  productName,
}) {
  const buyer = getBuyerNameParts(buyerName)

  return {
    action: 'authorize',
    channel: 'ecommerce',
    merchant_code: merchantCode,
    merchant_operation_number: normalizeOperationNumber(operationNumber),
    payment_method: {},
    payment_details: {
      amount: getAmountInMinorUnits(amount),
      currency: currencyCodes[currency] || '604',
      billing: {
        first_name: buyer.firstName,
        last_name: buyer.lastName,
        email: buyerEmail || 'cliente.demo@pay-me.com',
        phone: getBuyerPhone(phone),
        location: {
          line_1: 'Av. Ejemplo 123',
          line_2: '',
          city: 'Lima',
          state: 'Lima',
          country: 'Peru',
        },
      },
      additional_fields: {
        purchase_name: productName,
        company_name: companyName,
        commerce_code: commerceCode,
        device_origin: /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'celular' : 'laptop',
      },
    },
  }
}

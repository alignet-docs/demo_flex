import { useEffect, useRef, useState } from 'react'
import logoPayme from './assets/Logo-payme.webp'
import checkoutImage from './assets/Checkout-Image.png'
import cartDemoImage from './assets/cart-demo.png'
import paymeClearIcon from './assets/IconoClaroPayMe.png'
import bankTransferIcon from './assets/Iconos_metodos/Bank_trasfer.png'
import cuotealoIcon from './assets/Iconos_metodos/Cuotealo.png'
import pagoEfectivoIcon from './assets/Iconos_metodos/Pago_efectivo.png'
import qrIcon from './assets/Iconos_metodos/QR.png'
import yapeIcon from './assets/Iconos_metodos/Yape.png'
import {
  buildFlexPayload,
  createFlexSession,
  createOperationNumber,
  getFlexMethodCodes,
  normalizeOperationNumber,
} from './services/flexApi'
import './App.css'

const testDataUrl = 'https://docs.pay-me.com/pagos/datos-de-prueba'

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
]

const featureIcons = [
  <>
    <path d="M12 3 5 6v5c0 4.5 2.9 8.6 7 10 4.1-1.4 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </>,
  <>
    <path d="M8 7h8M8 17h8M7 7v3a5 5 0 0 0 10 0V7M7 17v-3a5 5 0 0 1 10 0v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 12h4M16 12h4" stroke="currentColor" strokeLinecap="round" />
  </>,
  <>
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" />
    <path d="M3 10h18M8 15h3" stroke="currentColor" strokeLinecap="round" />
    <path d="m16 14 1.2 1.2L20 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </>,
  <>
    <path d="M4 19V5M4 19h16" stroke="currentColor" strokeLinecap="round" />
    <path d="m7 15 3.5-4 3 3 4.5-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 8h-3M18 8v3" stroke="currentColor" strokeLinecap="round" />
  </>,
]

const experienceIcons = {
  paymentOptions: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" />
      <path d="M8 9h8M8 13h5" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  chargeData: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" />
      <path d="M4 10h16M8 15h3" stroke="currentColor" strokeLinecap="round" />
      <path d="M16 14h2" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  paymentMethods: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" />
      <path d="M7 14h4M15 14h2M7 10h10" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  summary: (
    <>
      <path d="M8 5h8l3 3v11H5V5h3Z" stroke="currentColor" strokeLinejoin="round" />
      <path d="M15 5v4h4M8 13h8M8 16h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

const visualIcons = {
  inline: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" />
      <path d="M3 8.5h18M7 12.5h10M7 16h6" stroke="currentColor" strokeLinecap="round" />
      <circle cx="6" cy="6.3" r=".7" fill="currentColor" />
    </>
  ),
  popup: (
    <>
      <rect x="3" y="3" width="13" height="13" rx="2.5" stroke="currentColor" opacity=".45" />
      <rect x="8" y="8" width="13" height="13" rx="2.5" fill="#eef4ff" stroke="currentColor" />
      <path d="M8 12h13" stroke="currentColor" />
      <circle cx="18.3" cy="10" r=".7" fill="currentColor" />
      <path d="M11.5 15.5h6M11.5 18h4" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  expanded: (
    <>
      <rect x="5.5" y="5.5" width="13" height="13" rx="2" stroke="currentColor" opacity=".45" />
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m3 3 6 6m12-6-6 6M3 21l6-6m12 6-6-6" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  container: (
    <>
      <rect x="7" y="7" width="10" height="10" stroke="currentColor" />
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" />
    </>
  ),
}

const copy = {
  es: {
    headerLabel: 'Cabecera principal',
    languageLabel: 'Seleccionar idioma',
    eyebrow: 'Flex',
    title: 'Checkout moderno para procesamiento de pagos.',
    description: 'Centraliza autorizaciones, tokenizacion y procesamiento en una experiencia rapida, segura y adaptable.',
    action: 'Ver demo',
    heroLabel: 'PayMe checkout',
    featuresLabel: 'Caracteristicas',
    back: 'Back',
    configTitle: 'Configura tu experiencia de pago',
    configSubtitle: 'Define como se vera Flex, cuanto se cobrara y que metodos estaran disponibles.',
    simulate: 'Simular experiencia',
    startDemo: 'Iniciar demo',
    paymentPreviewTitle: 'Selecciona como deseas pagar',
    payWithPayme: 'Paga con Pay-me',
    payWithPaymeDescription: 'Paga con tarjetas, Yape, QR y otros metodos habilitados de forma segura.',
    wallets: 'Billeteras',
    bankingServices: 'Tarjetas y servicios bancarios',
    purchaseSummary: 'Resumen de compra',
    productName: 'Demo checkout PayMe',
    subtotal: 'Subtotal',
    shipping: 'Envio',
    discounts: 'Descuentos',
    total: 'Total',
    goPay: 'Ir a pagar',
    preparingPay: 'Cargando Pay-me...',
    validatingPay: 'Validando pago seguro',
    testData: 'Datos de prueba',
    retryPay: 'Reintentar',
    authorizationResult: 'Resultado de autorizacion',
    authorizationReady: 'Autorizacion recibida',
    authorizationMessage: 'Pay-me devolvio la respuesta de la operacion.',
    newPayment: 'Nueva prueba',
    previewNote: 'Este es el formato en que se mostraran los metodos de pago dentro de tu demo.',
    editAgain: 'Volver a editar',
    continue: 'Continuar',
    skipDefaults: 'Saltar y usar valores por defecto',
    quickSummary: 'Resumen rápido',
    pending: 'Pendiente',
    paymentSecure: 'Pago seguro',
    selectedExperience: 'Secciones configurables',
    displayTitle: 'Opciones de pago',
    displaySubtitle: 'Elige como quieres mostrar el formulario',
    chargeData: 'Datos de cobro',
    amount: 'Monto',
    currency: 'Moneda',
    chargeSection: 'Datos del cobro',
    chargeSectionDescription: 'Define el monto y la moneda en la que se realizará el pago.',
    buyerSection: 'Datos del comprador',
    buyerSectionDescription: 'Información del cliente que realizará el pago.',
    buyerName: 'Nombre del comprador',
    buyerEmail: 'Correo electrónico',
    companyName: 'Nombre de la empresa',
    phone: 'Teléfono',
    optional: 'opcional',
    visualization: 'Visualización',
    methods: 'Métodos',
    chargeNote: 'Estos datos se usaran en la demo para fines de trazabilidad.',
    paymentMethods: 'Metodos de pago a habilitar',
    availableMethods: 'Metodos de pago disponibles',
    methodsNote: 'Puedes habilitar uno o varios metodos segun el flujo que desees mostrar en tu demo.',
    presentation: 'Presentacion de metodos',
    displayType: 'Tipo de visualización',
    displayFormat: 'Formato de visualización de métodos de pago',
    optionsTip: 'Tip: Puedes cambiar estas opciones más adelante.',
    summaryTitle: 'Resumen de datos configurativos',
    selectedDisplay: 'Visualizacion seleccionada',
    selectedPresentation: 'Presentacion seleccionada',
    selectedMethods: 'Metodos habilitados',
    formType: 'Tipo de formulario',
    extraConfig: 'Datos configurativos',
    commerceCode: 'Codigo de comercio',
    order: 'Numero de pedido',
    experiences: [
      { id: 'paymentOptions', shortLabel: 'Opciones', title: 'Opciones de pago', description: 'Elige cómo quieres mostrar el checkout en tu demo.' },
      { id: 'chargeData', shortLabel: 'Cobro', title: 'Datos de cobro', description: 'Configura monto, moneda y datos de la orden.' },
      { id: 'paymentMethods', shortLabel: 'Metodos', title: 'Metodos de pago', description: 'Elige que canales estaran habilitados.' },
      { id: 'summary', shortLabel: 'Resumen', title: 'Resumen configurativo', description: 'Revisa la configuracion final antes de simular.' },
    ],
    displayModes: [
      {
        id: 'inline',
        title: 'Formulario normal',
        description: 'Integrado en tu página',
        details: [
          'Pago sin cambiar de vista',
          'Experiencia fluida',
          'Ideal para eCommerce',
        ],
      },
      {
        id: 'popup',
        title: 'Pop-up',
        description: 'Formulario en ventana modal',
        details: [
          'Aparece centrado',
          'Mantiene al usuario en la tienda',
          'Integración rápida',
        ],
      },
      {
        id: 'expanded',
        title: 'Formulario expandido',
        description: 'Checkout en vista ampliada',
        details: [
          'Mayor espacio visual',
          'Destaca los métodos de pago',
          'Ideal para flujos personalizados',
        ],
      },
    ],
    layouts: [
      { id: 'accordion', label: 'Acordeón', description: 'Ocupa menos espacio y mejora la experiencia del usuario.' },
      { id: 'buttons', label: 'Botones separados', description: 'Muestra todos los métodos en una sola vista.' },
    ],
    features: [
      { title: 'Procesamiento seguro', description: 'Alta disponibilidad y transacciones protegidas.' },
      { title: 'Integracion flexible', description: 'APIs simples para integraciones rapidas.' },
      { title: 'Tokenizacion', description: 'Proteccion de tarjetas y pagos recurrentes.' },
      { title: 'Monitoreo en tiempo real', description: 'Seguimiento operativo y trazabilidad.' },
    ],
  },
  en: {
    headerLabel: 'Main header',
    languageLabel: 'Select language',
    eyebrow: 'Flex',
    title: 'Modern checkout for payment processing.',
    description: 'Centralize authorizations, tokenization, and processing in a fast, secure, adaptable experience.',
    action: 'View demo',
    heroLabel: 'PayMe checkout',
    featuresLabel: 'Features',
    back: 'Back',
    configTitle: 'Configure your payment experience',
    configSubtitle: 'Define how Flex will render, how much to charge, and which payment methods are enabled.',
    simulate: 'Simulate experience',
    startDemo: 'Start demo',
    paymentPreviewTitle: 'Select how you want to pay',
    payWithPayme: 'Pay with Pay-me',
    payWithPaymeDescription: 'Pay securely with cards, wallets, QR, and other enabled methods.',
    wallets: 'Wallets',
    bankingServices: 'Cards and banking services',
    purchaseSummary: 'Purchase summary',
    productName: 'PayMe demo checkout',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    discounts: 'Discounts',
    total: 'Total',
    goPay: 'Go to pay',
    preparingPay: 'Loading Pay-me...',
    validatingPay: 'Validating secure payment',
    testData: 'Test data',
    retryPay: 'Retry',
    authorizationResult: 'Authorization result',
    authorizationReady: 'Authorization received',
    authorizationMessage: 'Pay-me returned the operation response.',
    newPayment: 'New test',
    previewNote: 'This is the format in which payment methods will be shown inside your demo.',
    editAgain: 'Edit again',
    continue: 'Continue',
    skipDefaults: 'Skip and use default values',
    quickSummary: 'Quick summary',
    pending: 'Pending',
    paymentSecure: 'Secure payment',
    selectedExperience: 'Configurable sections',
    displayTitle: 'Payment options',
    displaySubtitle: 'Choose how you want to display the form',
    chargeData: 'Charge data',
    amount: 'Amount',
    currency: 'Currency',
    chargeSection: 'Charge data',
    chargeSectionDescription: 'Define the amount and currency in which the payment will be made.',
    buyerSection: 'Buyer data',
    buyerSectionDescription: 'Information about the customer making the payment.',
    buyerName: 'Buyer name',
    buyerEmail: 'Email',
    companyName: 'Company name',
    phone: 'Phone (optional)',
    optional: 'optional',
    visualization: 'Visualization',
    methods: 'Methods',
    chargeNote: 'This data will be used in the demo for traceability purposes.',
    paymentMethods: 'Payment methods to enable',
    availableMethods: 'Available payment methods',
    methodsNote: 'You can enable one or more methods depending on the flow you want to show in your demo.',
    presentation: 'Method presentation',
    displayType: 'Visualization type',
    displayFormat: 'Payment method display format',
    optionsTip: 'Tip: You can change these options later.',
    summaryTitle: 'Configuration data summary',
    selectedDisplay: 'Selected visualization',
    selectedPresentation: 'Selected presentation',
    selectedMethods: 'Enabled methods',
    formType: 'Form type',
    extraConfig: 'Configuration data',
    commerceCode: 'Commerce code',
    order: 'Order number',
    experiences: [
      { id: 'paymentOptions', shortLabel: 'Options', title: 'Payment options', description: 'Choose how you want to display the checkout in your demo.' },
      { id: 'chargeData', shortLabel: 'Charge', title: 'Charge data', description: 'Configure amount, currency, and order data.' },
      { id: 'paymentMethods', shortLabel: 'Methods', title: 'Payment methods', description: 'Choose which channels will be enabled.' },
      { id: 'summary', shortLabel: 'Summary', title: 'Configuration summary', description: 'Review the final setup before simulating.' },
    ],
    displayModes: [
      {
        id: 'inline',
        title: 'Normal form',
        description: 'Embedded in your page',
        details: [
          'Payment without changing views',
          'Seamless experience',
          'Ideal for eCommerce',
        ],
      },
      {
        id: 'popup',
        title: 'Pop-up',
        description: 'Form in a modal window',
        details: [
          'Appears centered',
          'Keeps the user inside the store',
          'Quick integration',
        ],
      },
      {
        id: 'expanded',
        title: 'Expanded form',
        description: 'Checkout in an expanded view',
        details: [
          'More visual space',
          'Highlights payment methods',
          'Ideal for customized flows',
        ],
      },
    ],
    layouts: [
      { id: 'accordion', label: 'Accordion', description: 'Uses less space and improves the user experience.' },
      { id: 'buttons', label: 'Separate buttons', description: 'Shows all payment methods in a single view.' },
    ],
    features: [
      { title: 'Secure processing', description: 'High availability and protected transactions.' },
      { title: 'Flexible integration', description: 'Simple APIs for fast integrations.' },
      { title: 'Tokenization', description: 'Card protection and recurring payments.' },
      { title: 'Real-time monitoring', description: 'Operational tracking and traceability.' },
    ],
  },
}

const currencies = ['Soles (PEN)', 'Dolares (USD)']
const methods = [
  { id: 'Tarjeta', title: 'Tarjeta', description: 'Credito y debito', icon: 'card' },
  { id: 'Yape', title: 'Yape', description: 'Pago movil', image: yapeIcon },
  { id: 'QR', title: 'QR', description: 'Escaneo rapido', image: qrIcon },
  { id: 'Pago Efectivo', title: 'Pago Efectivo', description: 'Cupon o codigo CIP', image: pagoEfectivoIcon },
  { id: 'Cuotealo', title: 'Cuotealo', description: 'Pago en cuotas', image: cuotealoIcon },
  { id: 'Transferencia Bancaria', title: 'Transferencia bancaria', description: 'Validacion diferida', image: bankTransferIcon },
]

const flexLayout = {
  naturalWidth: 415,
  naturalHeight: 656,
  modalPaddingX: 20,
  modalPaddingY: 15,
  minScale: 0.25,
}

const methodIcons = {
  card: (
    <>
      <rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" />
      <path d="M4 10h16" stroke="currentColor" />
    </>
  ),
  yape: (
    <>
      <text x="12" y="10" textAnchor="middle" fontSize="5" fontWeight="900" fill="currentColor">S/</text>
      <text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="900" fill="currentColor">yape</text>
    </>
  ),
  qr: (
    <>
      <rect x="5" y="5" width="4" height="4" rx="1" stroke="currentColor" />
      <rect x="15" y="5" width="4" height="4" rx="1" stroke="currentColor" />
      <rect x="5" y="15" width="4" height="4" rx="1" stroke="currentColor" />
      <path d="M14 14h2v2h3M19 19h-2M13 19v-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  cash: (
    <path d="M8 5 18 11 8 19V5Z" stroke="currentColor" strokeLinejoin="round" />
  ),
  installments: (
    <>
      <path d="M12 5v7h7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12a7 7 0 1 1-7-7" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
  bank: (
    <>
      <path d="M4 10h16L12 5 4 10Z" fill="currentColor" />
      <path d="M6 10v7M10 10v7M14 10v7M18 10v7M4 19h16" stroke="currentColor" strokeLinecap="round" />
    </>
  ),
}

function App() {
  const [language, setLanguage] = useState('es')
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [screen, setScreen] = useState('home')
  const [experience, setExperience] = useState('paymentOptions')
  const [displayMode, setDisplayMode] = useState('inline')
  const [amount, setAmount] = useState('1.00')
  const [currency, setCurrency] = useState(currencies[0])
  const [layout, setLayout] = useState('accordion')
  const [enabledMethods, setEnabledMethods] = useState(['Tarjeta', 'Yape', 'QR'])
  const [commerceCode] = useState('PAYME-DEMO-001')
  const [orderNumber, setOrderNumber] = useState(() => createOperationNumber())
  const [buyerName, setBuyerName] = useState('Juan Pérez')
  const [buyerEmail, setBuyerEmail] = useState('juan.perez@empresa.com')
  const [companyName, setCompanyName] = useState('Empresa Demo SAC')
  const [phone, setPhone] = useState('+51 999 888 777')
  const [selectedPreviewMethod, setSelectedPreviewMethod] = useState('Tarjeta')
  const [isFlexModalOpen, setIsFlexModalOpen] = useState(false)
  const [isFlexStarting, setIsFlexStarting] = useState(false)
  const [isFlexPreparing, setIsFlexPreparing] = useState(false)
  const [flexPlacement, setFlexPlacement] = useState(null)
  const [flexSession, setFlexSession] = useState(null)
  const [flexPreparationError, setFlexPreparationError] = useState('')
  const [flexError, setFlexError] = useState('')
  const [paymentResult, setPaymentResult] = useState(null)
  const [summaryRenderKey, setSummaryRenderKey] = useState(0)
  const flexInstanceRef = useRef(null)
  const isClosingFlexRef = useRef(false)
  const flexPlacementRef = useRef(null)
  const flexPreparationPromiseRef = useRef(null)
  const flexPreparationRequestRef = useRef(0)
  const flexStartRequestRef = useRef(0)
  const flexResizeObserverRef = useRef(null)
  const flexMutationObserverRef = useRef(null)
  const flexFitFrameRef = useRef(null)

  const content = copy[language]
  const activeLanguage = languages.find((item) => item.code === language)
  const activeStep = content.experiences.find((item) => item.id === experience)
  const activeStepIndex = content.experiences.findIndex((item) => item.id === experience)
  const activeDisplayMode = content.displayModes.find((item) => item.id === displayMode)
  const activeLayout = content.layouts.find((item) => item.id === layout)
  const enabledMethodDetails = methods.filter((method) => enabledMethods.includes(method.id))
  const walletMethods = enabledMethodDetails.filter((method) => ['Yape', 'QR'].includes(method.id))
  const bankMethods = enabledMethodDetails.filter((method) => !['Yape', 'QR'].includes(method.id))
  const canStartFlexPayment = Boolean(flexSession?.nonce) && !isFlexPreparing && !isFlexStarting
  const isPaymentButtonLoading = !flexSession?.nonce && !flexPreparationError

  useEffect(() => {
    window.addEventListener('resize', scheduleFlexFit)

    return () => {
      window.removeEventListener('resize', scheduleFlexFit)
      stopFlexResize()
      stopFlexMutation()
      stopFitFrame()
      terminateFlex()
    }
    // scheduleFlexFit only touches refs and DOM-managed Flex nodes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screen !== 'preview' || flexSession?.nonce || flexPreparationError) return

    prepareFlexSession()
    // prepareFlexSession is intentionally omitted to avoid recreating credentials on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, flexSession?.nonce, flexPreparationError])

  const selectLanguage = (languageCode) => {
    setLanguage(languageCode)
    setIsLanguageOpen(false)
  }

  const toggleMethod = (method) => {
    const nextMethods = enabledMethods.includes(method)
      ? enabledMethods.filter((item) => item !== method)
      : [...enabledMethods, method]

    setEnabledMethods(nextMethods)

    if (!nextMethods.includes(selectedPreviewMethod)) {
      setSelectedPreviewMethod(nextMethods[0] || 'Tarjeta')
    }
  }

  const goToNextStep = () => {
    const nextStep = content.experiences[activeStepIndex + 1]
    if (nextStep) {
      setExperience(nextStep.id)
    }
  }

  async function prepareFlexSession({ force = false } = {}) {
    if (force) {
      flexPreparationRequestRef.current += 1
      flexPreparationPromiseRef.current = null
    }

    if (!force && flexSession?.nonce) return flexSession
    if (!force && flexPreparationPromiseRef.current) return flexPreparationPromiseRef.current

    const requestId = flexPreparationRequestRef.current + 1
    flexPreparationRequestRef.current = requestId
    setFlexSession(null)
    setFlexPreparationError('')
    setIsFlexPreparing(true)

    const preparation = (async () => {
      const session = await createFlexSession()

      if (flexPreparationRequestRef.current !== requestId) return null

      setFlexSession(session)
      return session
    })()

    flexPreparationPromiseRef.current = preparation

    try {
      return await preparation
    } catch (error) {
      if (flexPreparationRequestRef.current !== requestId) return null

      console.error('Error preparando sesion Flex', error)
      setFlexPreparationError('No se pudo preparar el pago. Intenta nuevamente.')
      return null
    } finally {
      if (flexPreparationRequestRef.current === requestId) {
        setIsFlexPreparing(false)
      }

      if (flexPreparationPromiseRef.current === preparation) {
        flexPreparationPromiseRef.current = null
      }
    }
  }

  function openPaymentPreview() {
    setPaymentResult(null)
    setFlexPlacement(null)
    flexPlacementRef.current = null
    setFlexError('')
    invalidateFlexSession()
    setScreen('preview')
    prepareFlexSession({ force: true })
  }

  function invalidateFlexSession() {
    flexPreparationRequestRef.current += 1
    flexPreparationPromiseRef.current = null
    setFlexSession(null)
  }

  function getFlexPlacement() {
    if (displayMode === 'popup') return 'popup'
    if (displayMode === 'expanded') return 'expanded'
    return 'inline'
  }

  function waitForNextFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  }

  function getCssPixelVar(name, fallback) {
    const rawValue = getComputedStyle(document.documentElement).getPropertyValue(name)
    const parsedValue = Number.parseFloat(rawValue)
    return Number.isFinite(parsedValue) ? parsedValue : fallback
  }

  function getFlexMethods(methodOverride = selectedPreviewMethod) {
    return getFlexMethodCodes({
      enabledMethods,
      layout,
      selectedMethod: methodOverride,
    })
  }

  function getOperationNumber(value = orderNumber) {
    return normalizeOperationNumber(value)
  }

  function getFlexPayload(operationNumber = orderNumber, merchantCode = flexSession?.merchantCode) {
    return buildFlexPayload({
      amount,
      buyerEmail,
      buyerName,
      commerceCode,
      companyName,
      currency,
      merchantCode,
      operationNumber,
      phone,
      productName: content.productName,
    })
  }

  function resetFlexScale() {
    document.documentElement.style.setProperty('--flex-modal-scale', '1')
    document.documentElement.style.setProperty('--flex-natural-width', `${flexLayout.naturalWidth}px`)
    document.documentElement.style.setProperty('--flex-natural-height', `${flexLayout.naturalHeight}px`)
    document.documentElement.style.setProperty('--flex-modal-width', `${flexLayout.naturalWidth}px`)
    document.documentElement.style.setProperty('--flex-modal-height', `${flexLayout.naturalHeight}px`)
  }

  function stopFlexResize() {
    if (!flexResizeObserverRef.current) return
    flexResizeObserverRef.current.disconnect()
    flexResizeObserverRef.current = null
  }

  function stopFlexMutation() {
    if (!flexMutationObserverRef.current) return
    flexMutationObserverRef.current.disconnect()
    flexMutationObserverRef.current = null
  }

  function stopFitFrame() {
    if (!flexFitFrameRef.current) return
    cancelAnimationFrame(flexFitFrameRef.current)
    flexFitFrameRef.current = null
  }

  function terminateFlex() {
    if (flexInstanceRef.current && typeof flexInstanceRef.current.terminate === 'function') {
      flexInstanceRef.current.terminate()
    }
    flexInstanceRef.current = null
  }

  function fitFlexToViewport() {
    const demo = document.getElementById('demo')
    const gateway = demo?.querySelector('.payment-gateway-container')
    if (!gateway) return false

    if (flexPlacementRef.current !== 'popup') {
      document.documentElement.style.setProperty('--flex-modal-scale', '1')
      document.documentElement.style.setProperty('--flex-natural-width', '100%')
      document.documentElement.style.setProperty('--flex-modal-width', '100%')
      document.documentElement.style.setProperty('--flex-modal-height', 'auto')
      return true
    }

    const naturalWidth = Math.max(1, gateway.offsetWidth || flexLayout.naturalWidth)
    const naturalHeight = Math.max(1, gateway.scrollHeight || gateway.offsetHeight || flexLayout.naturalHeight)
    const modalPaddingX = getCssPixelVar('--flex-modal-padding-x', flexLayout.modalPaddingX)
    const modalPaddingY = getCssPixelVar('--flex-modal-padding-y', flexLayout.modalPaddingY)
    const availableWidth = Math.max(1, window.innerWidth - modalPaddingX * 2)
    const availableHeight = Math.max(1, window.innerHeight - modalPaddingY * 2)
    const scale = Math.min(1, availableWidth / naturalWidth, availableHeight / naturalHeight)
    const appliedScale = Math.max(flexLayout.minScale, scale)

    document.documentElement.style.setProperty('--flex-natural-width', `${Math.ceil(naturalWidth)}px`)
    document.documentElement.style.setProperty('--flex-natural-height', `${Math.ceil(naturalHeight)}px`)
    document.documentElement.style.setProperty('--flex-modal-scale', String(appliedScale))
    document.documentElement.style.setProperty('--flex-modal-width', `${Math.ceil(naturalWidth * appliedScale)}px`)
    document.documentElement.style.setProperty('--flex-modal-height', `${Math.ceil(naturalHeight * appliedScale)}px`)
    return true
  }

  function scheduleFlexFit() {
    stopFitFrame()
    flexFitFrameRef.current = requestAnimationFrame(() => {
      flexFitFrameRef.current = null
      if (fitFlexToViewport()) {
        document.getElementById('demo')?.classList.add('is-ready')
      }
    })
  }

  function startFlexResize() {
    stopFlexResize()
    stopFlexMutation()
    if (fitFlexToViewport()) {
      document.getElementById('demo')?.classList.add('is-ready')
    }

    const demo = document.getElementById('demo')
    const gateway = demo?.querySelector('.payment-gateway-container')

    if (gateway && typeof ResizeObserver !== 'undefined') {
      flexResizeObserverRef.current = new ResizeObserver(() => scheduleFlexFit())
      flexResizeObserverRef.current.observe(gateway)
    }

    if (demo && typeof MutationObserver !== 'undefined') {
      flexMutationObserverRef.current = new MutationObserver(() => {
        scheduleFlexFit()

        const currentGateway = demo.querySelector('.payment-gateway-container')
        if (currentGateway && !flexResizeObserverRef.current && typeof ResizeObserver !== 'undefined') {
          flexResizeObserverRef.current = new ResizeObserver(() => scheduleFlexFit())
          flexResizeObserverRef.current.observe(currentGateway)
        }
      })
      flexMutationObserverRef.current.observe(demo, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }
  }

  function isCartClosedError(error) {
    const message = String(error?.message || error || '').toLowerCase()
    return message.includes('cerro el carrito')
  }

  function closeFlexModal({ prepareNext = true } = {}) {
    if (isClosingFlexRef.current) return
    isClosingFlexRef.current = true
    const demo = document.getElementById('demo')

    flexStartRequestRef.current += 1
    stopFlexResize()
    stopFlexMutation()
    stopFitFrame()
    terminateFlex()
    resetFlexScale()
    setIsFlexModalOpen(false)
    setIsFlexStarting(false)
    setFlexPlacement(null)
    flexPlacementRef.current = null
    setFlexError('')
    setSummaryRenderKey((current) => current + 1)
    invalidateFlexSession()

    if (demo) {
      demo.innerHTML = ''
      demo.style.display = 'none'
      demo.classList.remove('is-ready')
    }

    if (prepareNext && screen === 'flexExpanded') {
      setScreen('preview')
    }

    requestAnimationFrame(() => {
      isClosingFlexRef.current = false
      if (prepareNext && screen === 'preview') {
        prepareFlexSession({ force: true })
      }
    })
  }

  async function restartInlineFlexForMethod(methodId) {
    const demo = document.getElementById('demo')

    flexStartRequestRef.current += 1
    stopFlexResize()
    stopFlexMutation()
    stopFitFrame()
    terminateFlex()
    resetFlexScale()
    invalidateFlexSession()
    setIsFlexStarting(true)
    setFlexError('')

    if (demo) {
      demo.innerHTML = ''
      demo.style.display = 'none'
      demo.classList.remove('is-ready')
    }

    await startFlexPayment({ methodOverride: methodId, forceNewSession: true })
  }

  function handlePreviewMethodSelect(methodId) {
    if (methodId === selectedPreviewMethod) return

    setSelectedPreviewMethod(methodId)

    if (displayMode !== 'inline' || layout !== 'buttons' || flexPlacementRef.current !== 'inline') return

    restartInlineFlexForMethod(methodId)
  }

  async function startFlexPayment({ methodOverride = selectedPreviewMethod, forceNewSession = false } = {}) {
    const startRequestId = flexStartRequestRef.current + 1
    flexStartRequestRef.current = startRequestId
    const session = !forceNewSession && flexSession?.nonce
      ? flexSession
      : await prepareFlexSession({ force: forceNewSession })
    if (flexStartRequestRef.current !== startRequestId) return
    if (!session?.nonce) return

    const placement = getFlexPlacement()
    flexPlacementRef.current = placement
    setFlexPlacement(placement)

    if (placement === 'popup') {
      setIsFlexModalOpen(true)
    } else if (placement === 'expanded') {
      setScreen('flexExpanded')
    } else {
      setIsFlexModalOpen(false)
    }

    setIsFlexStarting(true)
    setFlexError('')
    resetFlexScale()

    await waitForNextFrame()
    if (flexStartRequestRef.current !== startRequestId) return

    const demo = document.getElementById('demo')
    if (!demo) {
      setIsFlexStarting(false)
      setFlexError('No se encontro el contenedor de Pay-me.')
      return
    }

    demo.style.display = 'none'
    demo.classList.remove('is-ready')
    demo.innerHTML = ''

    try {
      if (typeof window.FlexPaymentForms !== 'function') {
        throw new Error('La libreria FlexPaymentForms no esta cargada.')
      }

      const flexMethods = getFlexMethods(methodOverride)
      const nextOperationNumber = createOperationNumber()
      setOrderNumber(nextOperationNumber)
      const payload = getFlexPayload(nextOperationNumber, session.merchantCode)

      console.log('Payload Flex', payload)
      console.log('Metodos enviados a Flex', flexMethods)

      flexInstanceRef.current = new window.FlexPaymentForms({
        nonce: session.nonce,
        payload,
        settings: {
          display_result_screen: true,
          show_close_button: true,
          show_border: placement !== 'inline',
          show_operation_number: true,
        },
        display_settings: {
          methods: flexMethods,
        },
        i18n: {
          mode: 'multi',
          default_language: language,
          languages: ['es', 'en'],
        },
      })

      flexInstanceRef.current.init(
        demo,
        (response) => {
          if (flexStartRequestRef.current !== startRequestId) return
          console.log('Respuesta Flex', response)
          setIsFlexStarting(false)
          setPaymentResult(response)
          closeFlexModal({ prepareNext: false })
          setScreen('paymentResult')
        },
        (tracking) => {
          if (flexStartRequestRef.current !== startRequestId) return
          console.log('Tracking Flex', tracking)
        },
        (error) => {
          if (flexStartRequestRef.current !== startRequestId) return
          console.error('Error Flex', error)
          if (isCartClosedError(error)) {
            closeFlexModal()
            if (placement === 'expanded') {
              setScreen('preview')
            }
            return
          }
          setIsFlexStarting(false)
          setFlexError(String(error?.message || error || 'No se pudo procesar el pago.'))
          invalidateFlexSession()
          prepareFlexSession({ force: true })
        },
      )

      demo.style.display = 'block'
      requestAnimationFrame(() => {
        if (flexStartRequestRef.current !== startRequestId) return
        startFlexResize()
        setIsFlexStarting(false)
        ;[50, 150, 300, 600].forEach((delay) => {
          setTimeout(() => {
            if (fitFlexToViewport()) {
              demo.classList.add('is-ready')
            }
          }, delay)
        })
      })
    } catch (error) {
      console.error('No se pudo cargar Flex', error)
      setIsFlexStarting(false)
      setFlexError(String(error?.message || error || 'No se pudo cargar Flex.'))
    }
  }

  const renderMethodBadge = (method) => (
    <span className="preview-method-icon">
      {method.image ? (
        <img src={method.image} alt="" />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {methodIcons[method.icon]}
        </svg>
      )}
    </span>
  )

  const renderPreviewMethod = (method, variant = 'accordion') => (
    <button
      className={`preview-method ${variant === 'buttons' ? 'preview-method-button' : ''}`}
      type="button"
      aria-pressed={selectedPreviewMethod === method.id}
      key={method.id}
      onClick={() => handlePreviewMethodSelect(method.id)}
    >
      <span className="preview-radio" />
      {renderMethodBadge(method)}
      <span className="preview-method-copy">
        <strong>{method.title}</strong>
        <small>{method.description}</small>
      </span>
      {variant === 'accordion' && (
        <svg className="preview-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )

  const renderPaymentSelector = () => {
    if (layout === 'accordion') {
      return (
        <button className="payme-single-option" type="button" aria-pressed="true">
          <span className="preview-radio" />
          <span className="payme-single-icon">
            <img src={paymeClearIcon} alt="" />
          </span>
          <span className="preview-method-copy">
            <strong>{content.payWithPayme}</strong>
            <small>{content.payWithPaymeDescription}</small>
          </span>
        </button>
      )
    }

    return (
      <>
        {walletMethods.length > 0 && (
          <section className="preview-group">
            <h2>{content.wallets}</h2>
            <div className="preview-method-list">
              {walletMethods.map((method) => renderPreviewMethod(method, 'buttons'))}
            </div>
          </section>
        )}
        {bankMethods.length > 0 && (
          <section className="preview-group">
            <h2>{content.bankingServices}</h2>
            <div className="preview-method-list">
              {bankMethods.map((method) => renderPreviewMethod(method, 'buttons'))}
            </div>
          </section>
        )}
      </>
    )
  }

  const renderStepPanel = () => {
    if (experience === 'paymentOptions') {
      return (
        <>
          <h2 className="option-group-title">{content.displayType}</h2>
          <div className="display-list">
            {content.displayModes.map((item) => (
              <button
                className="display-option"
                type="button"
                aria-pressed={displayMode === item.id}
                key={item.id}
                onClick={() => setDisplayMode(item.id)}
              >
                <span className="display-option-head">
                  <span className="display-icon">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {visualIcons[item.id]}
                    </svg>
                  </span>
                  <span className="option-radio" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="m7 12 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="display-option-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                  {item.details && (
                    <span className="display-details">
                      <span className="display-details-inner">
                        {item.details.map((detail) => (
                          <span className="display-detail" key={detail}>
                            <span className="display-detail-check" aria-hidden="true">
                              <svg viewBox="0 0 20 20" fill="none">
                                <path d="m4 10 4 4 8-9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                            <span>{detail}</span>
                          </span>
                        ))}
                      </span>
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="divider" />

          <div className="format-section">
            <h2 className="panel-subtitle">{content.displayFormat}</h2>
          </div>
          <div className="format-control">
            {content.layouts.map((item) => (
              <button
                type="button"
                aria-pressed={layout === item.id}
                key={item.id}
                onClick={() => setLayout(item.id)}
              >
                <svg className="format-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {item.id === 'accordion' ? (
                    <>
                      <path d="M8 7h12M8 12h12M8 17h12" stroke="currentColor" strokeLinecap="round" />
                      <circle cx="4" cy="7" r="1" fill="currentColor" />
                      <circle cx="4" cy="12" r="1" fill="currentColor" />
                      <circle cx="4" cy="17" r="1" fill="currentColor" />
                    </>
                  ) : (
                    <>
                      <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" />
                      <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" />
                      <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" />
                      <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" />
                    </>
                  )}
                </svg>
                <span className="format-control-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="option-radio" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m7 12 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
          <div className="options-tip" role="note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18h6M10 21h4" stroke="currentColor" strokeLinecap="round" />
              <path d="M8.6 15.5C7 14.4 6 12.6 6 10.5a6 6 0 1 1 12 0c0 2.1-1 3.9-2.6 5-.8.6-1.4 1.4-1.4 2.5h-4c0-1.1-.6-1.9-1.4-2.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11.5 11.5 13l3-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{content.optionsTip}</span>
          </div>
        </>
      )
    }

    if (experience === 'chargeData') {
      return (
        <div className="charge-form">
          <div className="form-section-heading">
            <span className="form-section-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" />
                <path d="M4 10h16M8 15h4" stroke="currentColor" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h3>{content.chargeSection}</h3>
              <p>{content.chargeSectionDescription}</p>
            </div>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>{content.amount}</span>
              <input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value)} />
            </label>
            <label className="field">
              <span>{content.currency}</span>
              <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                {currencies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-separator" />

          <div className="form-section-heading">
            <span className="form-section-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3" stroke="currentColor" />
                <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h3>{content.buyerSection}</h3>
              <p>{content.buyerSectionDescription}</p>
            </div>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>{content.buyerName}</span>
              <input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} />
            </label>
            <label className="field">
              <span>{content.buyerEmail}</span>
              <input value={buyerEmail} inputMode="email" onChange={(event) => setBuyerEmail(event.target.value)} />
            </label>
            <label className="field">
              <span>{content.companyName} <small className="optional-label">({content.optional})</small></span>
              <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            </label>
            <label className="field">
              <span>{content.phone.replace(/\s*\(optional\)$/, '')} <small className="optional-label">({content.optional})</small></span>
              <input value={phone} inputMode="tel" onChange={(event) => setPhone(event.target.value)} />
            </label>
          </div>

          <div className="info-note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeLinecap="round" />
            </svg>
            {content.chargeNote}
          </div>
        </div>
      )
    }

    if (experience === 'paymentMethods') {
      return (
        <div className="methods-panel">
          <h3>{content.availableMethods}</h3>
          <div className="method-card-grid">
            {methods.map((method) => (
              <button
                className="method-card"
                type="button"
                aria-pressed={enabledMethods.includes(method.id)}
                key={method.id}
                onClick={() => toggleMethod(method.id)}
              >
                <span className="method-card-icon">
                  {method.image ? (
                    <img src={method.image} alt="" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {methodIcons[method.icon]}
                    </svg>
                  )}
                </span>
                <span className="method-card-copy">
                  <strong>{method.title}</strong>
                  <small>{method.description}</small>
                </span>
                <span className="method-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m7 12 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
          <div className="info-note">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeLinecap="round" />
            </svg>
            {content.methodsNote}
          </div>
        </div>
      )
    }

    return (
      <div className="final-summary">
        <section className="final-summary-row">
          <span className="final-summary-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {visualIcons[displayMode]}
            </svg>
          </span>
          <div className="final-summary-content">
            <h3>{content.selectedDisplay}</h3>
            <div className="final-summary-grid two-cols">
              <div>
                <small>{content.formType}</small>
                <strong>{activeDisplayMode.title}</strong>
              </div>
              <div>
                <small>{content.displayFormat}</small>
                <strong>{activeLayout.label}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="final-summary-row">
          <span className="final-summary-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v16M16 8.5c-.8-.7-1.8-1-3-1-1.8 0-3 .9-3 2.2 0 3.5 6.5 1.4 6.5 5 0 1.4-1.3 2.3-3.3 2.3-1.4 0-2.8-.5-3.7-1.4" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </span>
          <div className="final-summary-content">
            <h3>{content.chargeSection}</h3>
            <div className="final-summary-grid two-cols">
              <div>
                <small>{content.amount}</small>
                <strong>{amount || '0'}</strong>
              </div>
              <div>
                <small>{content.currency}</small>
                <strong>{currency}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="final-summary-row">
          <span className="final-summary-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3" stroke="currentColor" />
              <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </span>
          <div className="final-summary-content">
            <h3>{content.buyerSection}</h3>
            <div className="final-summary-grid four-cols">
              <div>
                <small>{content.buyerName}</small>
                <strong>{buyerName}</strong>
              </div>
              <div>
                <small>{content.buyerEmail}</small>
                <strong>{buyerEmail}</strong>
              </div>
              <div>
                <small>{content.companyName}</small>
                <strong>{companyName}</strong>
              </div>
              <div>
                <small>{content.phone}</small>
                <strong>{phone}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="final-summary-row">
          <span className="final-summary-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {experienceIcons.paymentMethods}
            </svg>
          </span>
          <div className="final-summary-content">
            <h3>{content.selectedMethods}</h3>
            <div className="final-methods">
              {enabledMethodDetails.map((method) => (
                <span className="final-method-chip" key={method.id}>
                  {method.image ? (
                    <img src={method.image} alt="" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      {methodIcons[method.icon]}
                    </svg>
                  )}
                  {method.title}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="final-actions">
          <button className="simulate-action final-start" type="button" onClick={openPaymentPreview}>
            {content.startDemo}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="defaults-action" type="button" onClick={() => setExperience('paymentOptions')}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 6 3 3L8 19H5v-3L15 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {content.editAgain}
          </button>
        </div>
      </div>
    )
  }

  const renderPaymentAction = () => (
    <>
      <button className="simulate-action pay-action" type="button" disabled={!canStartFlexPayment} onClick={startFlexPayment}>
        <span>{content.goPay}</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isPaymentButtonLoading && (
        <div className="payment-ready-status" role="status">
          <span className="button-spinner" aria-hidden="true" />
          <span>{content.validatingPay}</span>
        </div>
      )}
      {flexPreparationError && (
        <div className="flex-preparation-error">
          <span>{flexPreparationError}</span>
          <button type="button" onClick={prepareFlexSession}>
            {content.retryPay}
          </button>
        </div>
      )}
    </>
  )

  const renderTestDataButton = () => (
    <a
      className="test-data-fab"
      href={testDataUrl}
      target="_blank"
      rel="noreferrer"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h7M7 12h5M7 17h3" stroke="currentColor" strokeLinecap="round" />
        <path d="M15 4h4v4M14 9l5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" />
      </svg>
      {content.testData}
    </a>
  )

  const shouldShowTestDataButton = ['preview', 'flexExpanded', 'paymentResult'].includes(screen)

  const renderPurchaseSummary = () => (
    <aside className="purchase-summary" key={summaryRenderKey}>
      <div className="purchase-summary-head">
        <h2>{content.purchaseSummary}</h2>
      </div>
      <div className="purchase-product">
        <div className="product-art" aria-hidden="true">
          <img src={cartDemoImage} alt="" />
        </div>
        <div>
          <strong>{content.productName}</strong>
          <span>S/ {amount || '0.00'}</span>
        </div>
      </div>
      <div className="purchase-lines">
        <div>
          <span>{content.subtotal}</span>
          <strong>S/ {amount || '0.00'}</strong>
        </div>
        <div>
          <span>{content.shipping}</span>
          <strong>S/ 0.00</strong>
        </div>
        <div>
          <span>{content.discounts}</span>
          <strong>-S/ 0.00</strong>
        </div>
      </div>
      <div className="purchase-total">
        <span>{content.total}</span>
        <strong>S/ {amount || '0.00'}</strong>
      </div>
      {renderPaymentAction()}
    </aside>
  )

  const renderInlineFlexPanel = () => (
    <aside className="purchase-summary flex-inline-panel">
      {isFlexStarting && <div className="flex-embedded-loading">{content.preparingPay}</div>}
      {flexError && <div className="flex-error flex-error-inline">{flexError}</div>}
      <div id="demo" data-placement="inline" />
    </aside>
  )

  const renderExpandedFlexScreen = () => (
    <section className="checkout-preview-screen flex-expanded-screen" aria-label={content.payWithPayme}>
      <div className="browser-frame">
        <div className="browser-topbar">
          <span className="traffic-dot red" />
          <span className="traffic-dot yellow" />
          <span className="traffic-dot green" />
          <div className="browser-url">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="7" y="10" width="10" height="8" rx="2" fill="currentColor" />
              <path d="M9 10V8a3 3 0 0 1 6 0v2" stroke="currentColor" strokeLinecap="round" />
            </svg>
            demo-checkout.example.com/pay-me
          </div>
          <div className="browser-nav-group" aria-hidden="true">
            <span className="browser-nav">‹</span>
            <span className="browser-nav">›</span>
          </div>
        </div>
        <div className="flex-expanded-content">
          <div className="flex-expanded-toolbar">
            <button className="preview-back" type="button" onClick={() => closeFlexModal()}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Volver
            </button>
          </div>
          {isFlexStarting && <div className="flex-embedded-loading">{content.preparingPay}</div>}
          {flexError && <div className="flex-error flex-error-inline">{flexError}</div>}
          <div id="demo" data-placement="expanded" />
        </div>
      </div>
    </section>
  )

  const renderPaymentResult = () => (
    <section className="checkout-preview-screen payment-result-screen" aria-label={content.authorizationResult}>
      <div className="payment-result-card">
        <span className="payment-result-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m7 12 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1>{content.authorizationReady}</h1>
        <p>{content.authorizationMessage}</p>
        <div className="payment-result-data">
          <div>
            <small>{content.order}</small>
            <strong>{getOperationNumber()}</strong>
          </div>
          <div>
            <small>{content.total}</small>
            <strong>S/ {amount || '0.00'}</strong>
          </div>
          <div>
            <small>{content.selectedMethods}</small>
            <strong>{enabledMethods.join(', ')}</strong>
          </div>
        </div>
        {paymentResult && (
          <pre className="payment-result-json">{JSON.stringify(paymentResult, null, 2)}</pre>
        )}
        <button className="simulate-action final-start" type="button" onClick={openPaymentPreview}>
          {content.newPayment}
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  )

  return (
    <main className="page">
      <header className="topbar" aria-label={content.headerLabel}>
        <button className="brand" type="button" aria-label="PayMe inicio" onClick={() => setScreen('home')}>
          <img className="brand-logo" src={logoPayme} alt="PayMe" />
        </button>

        <div className="language-picker">
          <button
            className="language"
            type="button"
            aria-label={content.languageLabel}
            aria-expanded={isLanguageOpen}
            aria-haspopup="listbox"
            onClick={() => setIsLanguageOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9s-1.1 6.5-3.3 9M12 3c-2.2 2.5-3.3 5.5-3.3 9s1.1 6.5 3.3 9" stroke="currentColor" />
            </svg>
            <span>{activeLanguage.label}</span>
            <svg className="language-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isLanguageOpen && (
            <div className="language-menu" role="listbox" aria-label={content.languageLabel}>
              {languages.map((item) => (
                <button
                  className="language-option"
                  type="button"
                  role="option"
                  aria-selected={item.code === language}
                  key={item.code}
                  onClick={() => selectLanguage(item.code)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {screen === 'home' ? (
        <>
          <section className="hero" aria-label={content.heroLabel}>
            <div className="copy">
              <div className="eyebrow">{content.eyebrow}</div>
              <h1>{content.title}</h1>
              <p className="hero-description">{content.description}</p>
              <button className="primary-action" type="button" aria-label={content.action} onClick={() => setScreen('demo')}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
                </svg>
                {content.action}
              </button>
            </div>

            <div className="visual" aria-hidden="true">
              <img className="checkout-art" src={checkoutImage} alt="" />
            </div>
          </section>

          <footer id="features" className="features-footer" aria-label={content.featuresLabel}>
            <div className="features">
              {content.features.map((feature, index) => (
                <article className="feature" key={feature.title}>
                  <span className="feature-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      {featureIcons[index]}
                    </svg>
                  </span>
                  <div>
                    <h2>{feature.title}</h2>
                    <p>{feature.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </footer>
        </>
      ) : screen === 'demo' ? (
        <section className="demo-screen" aria-label={content.configTitle}>
          <button className="back-action" type="button" onClick={() => setScreen('home')}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {content.back}
          </button>

          <div className="demo-heading">
            <h1>{content.configTitle}</h1>
            <p>{content.configSubtitle}</p>
          </div>

          <div className="demo-workspace">
            <div className="experience-grid" aria-label={content.selectedExperience}>
              {content.experiences.map((item, index) => (
                <button
                  className="experience-card"
                  type="button"
                  aria-pressed={experience === item.id}
                  key={item.id}
                  onClick={() => setExperience(item.id)}
                >
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="step-label">
                    {item.shortLabel}
                  </span>
                </button>
              ))}
            </div>

            <div className={experience === 'summary' ? 'config-shell config-shell-summary' : 'config-shell'}>
              <section className="visual-options step-panel">
                 <div className="section-title">
                  <div>
                    <h2>Paso {activeStepIndex + 1}. {activeStep.shortLabel}</h2>
                    <p>{activeStep.description}</p>
                  </div>
                </div> 
                {renderStepPanel()}
              </section>

              {experience !== 'summary' && (
              <aside className="config-panel">
                <h2>{content.quickSummary}</h2>
                <div className="quick-summary">
                  <div className="quick-row">
                    <span className="quick-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {visualIcons[displayMode]}
                      </svg>
                    </span>
                    <span>
                      <small>{content.visualization}</small>
                      <strong>{activeDisplayMode.title}</strong>
                    </span>
                  </div>
                  <div className="quick-row">
                    <span className="quick-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 4v16M16 8.5c-.8-.7-1.8-1-3-1-1.8 0-3 .9-3 2.2 0 3.5 6.5 1.4 6.5 5 0 1.4-1.3 2.3-3.3 2.3-1.4 0-2.8-.5-3.7-1.4" stroke="currentColor" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span>
                      <small>{content.amount}</small>
                      <strong>{amount ? `${amount} - ${currency}` : content.pending}</strong>
                    </span>
                  </div>
                  <div className="quick-row">
                    <span className="quick-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {experienceIcons.paymentMethods}
                      </svg>
                    </span>
                    <span>
                      <small>{content.methods}</small>
                      <strong>{enabledMethods.length ? enabledMethods.join(', ') : content.pending}</strong>
                    </span>
                  </div>
                  <div className="quick-row">
                    <span className="quick-icon">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {experienceIcons.summary}
                      </svg>
                    </span>
                    <span>
                      <small>{content.selectedPresentation}</small>
                      <strong>{activeLayout.label}</strong>
                    </span>
                  </div>
                </div>

                <button className="simulate-action" type="button" onClick={goToNextStep}>
                  {activeStepIndex === content.experiences.length - 1 ? content.simulate : content.continue}
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="defaults-action" type="button" onClick={() => setExperience('summary')}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m5 7 5 5-5 5M12 7l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {content.skipDefaults}
                </button>
              </aside>
              )}
            </div>
          </div>
        </section>
      ) : screen === 'preview' ? (
        <section className="checkout-preview-screen" aria-label={content.paymentPreviewTitle}>
          <div className="browser-frame">
            <div className="browser-topbar">
              <span className="traffic-dot red" />
              <span className="traffic-dot yellow" />
              <span className="traffic-dot green" />
              <div className="browser-url">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="7" y="10" width="10" height="8" rx="2" fill="currentColor" />
                  <path d="M9 10V8a3 3 0 0 1 6 0v2" stroke="currentColor" strokeLinecap="round" />
                </svg>
                demo-checkout.example.com
              </div>
              <div className="browser-nav-group" aria-hidden="true">
                <span className="browser-nav">‹</span>
                <span className="browser-nav">›</span>
              </div>
            </div>

            <div className="browser-content">
              <div className="preview-main">
                <button className="preview-back" type="button" onClick={() => setScreen('demo')}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Volver
                </button>
                <h1>{content.paymentPreviewTitle}</h1>
                {renderPaymentSelector()}
                <div className="info-note preview-note">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" />
                    <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeLinecap="round" />
                  </svg>
                  {content.previewNote}
                </div>
              </div>

              {flexPlacement === 'inline' ? renderInlineFlexPanel() : renderPurchaseSummary()}
            </div>
          </div>
          <div
            id="paymentModal"
            className={`flex-modal ${isFlexModalOpen ? 'is-open' : ''}`}
            aria-hidden={!isFlexModalOpen}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeFlexModal()
            }}
          >
            <div className="flex-modal-card">
              {isFlexStarting && <div className="flex-loading">Cargando Flex...</div>}
              {flexError && <div className="flex-error">{flexError}</div>}
              {flexPlacement === 'popup' && <div id="demo" data-placement="popup" />}
            </div>
          </div>
        </section>
      ) : screen === 'flexExpanded' ? (
        renderExpandedFlexScreen()
      ) : (
        renderPaymentResult()
      )}
      {shouldShowTestDataButton && renderTestDataButton()}
    </main>
  )
}

export default App

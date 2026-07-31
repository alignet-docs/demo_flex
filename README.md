# Demo Flex en GitHub Pages

Demo estática de checkout Pay-me/Flex construida con React y Vite.

## Desarrollo local

```bash
npm ci
cp .env.example .env
```

Completa `.env` y ejecuta:

```bash
npm run dev
```

## Configuración en GitHub

En **Settings → Secrets and variables → Actions → Secrets**, crea:

- `FLEX_AUTH_BASE_URL`
- `FLEX_API_AUDIENCE`
- `FLEX_ASSET_BASE_URL`
- `FLEX_CLIENT_ID`
- `FLEX_CLIENT_SECRET`
- `FLEX_MERCHANT_CODE`
- `FLEX_TOKEN_SCOPE`
- `FLEX_NONCE_SCOPE`

El workflow `Deploy GitHub Pages` convierte estos nombres en variables `VITE_*` durante el build y publica `dist` bajo `/demo_flex/`.

## Advertencia de seguridad

Esta variante no usa backend porque está destinada únicamente a una demo controlada. Las variables `VITE_*`, incluido el client secret, quedan incorporadas en el JavaScript descargado por cada visitante y pueden inspeccionarse desde el navegador. Los GitHub Secrets ocultan los valores en los logs de Actions, pero no pueden mantenerlos secretos dentro de una aplicación estática.

No uses credenciales de producción en este despliegue. Emplea credenciales limitadas y rótalas al terminar la demo.

## Validación

```bash
npm run lint
npm run build
```

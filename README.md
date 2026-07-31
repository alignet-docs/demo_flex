# Demo Flex para Vercel

Demo de checkout Pay-me/Flex con frontend React/Vite y una función serverless segura en `/api/flex/session`. Las credenciales Flex se leen únicamente desde las Environment Variables de Vercel y no se incorporan al JavaScript del navegador.

## Publicar todo en Vercel

1. En Vercel selecciona **Add New → Project** e importa `alignet-docs/demo_flex`.
2. Vercel detectará Vite. Conserva:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. En **Project Settings → Environment Variables**, agrega las variables indicadas abajo para `Production` y, si lo necesitas, `Preview`.
4. Pulsa **Deploy**. Si agregas o cambias variables después, ejecuta **Redeploy** para aplicarlas.

La aplicación y la API quedarán en el mismo dominio de Vercel, así que `VITE_FLEX_API_BASE_URL` debe permanecer vacío.

## Variables de Vercel

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `FLEX_AUTH_BASE_URL` | Sí | URL de autenticación de Flex |
| `FLEX_API_AUDIENCE` | Sí | Audience de la API |
| `FLEX_ASSET_BASE_URL` | Sí | URL base del JS y CSS de Flex |
| `FLEX_CLIENT_ID` | Sí | Client ID de Flex |
| `FLEX_CLIENT_SECRET` | Sí | Client secret de Flex |
| `FLEX_MERCHANT_CODE` | Sí | Código de comercio |
| `FLEX_TOKEN_SCOPE` | No | Scope del token; tiene valor predeterminado |
| `FLEX_NONCE_SCOPE` | No | Scope del nonce; tiene valor predeterminado |
| `APP_ORIGIN` | Sólo con Pages | Orígenes permitidos separados por coma |

No uses el prefijo `VITE_` para las credenciales Flex: Vite publicaría sus valores.

## Mantener el frontend en GitHub Pages

También puedes desplegar solamente la función en Vercel y mantener la interfaz actual en Pages:

1. Configura en Vercel `APP_ORIGIN=https://alignet-docs.github.io`.
2. En GitHub abre **Settings → Secrets and variables → Actions → Variables**.
3. Crea `FLEX_API_BASE_URL` con el dominio de Vercel, por ejemplo `https://demo-flex.vercel.app`, sin `/api/flex/session` al final.
4. Ejecuta el workflow **Deploy GitHub Pages**.

## Desarrollo

El frontend local puede iniciarse con `npm run dev`. Para ejecutar también la función `/api`, utiliza `vercel dev` después de vincular el proyecto y configurar sus variables de desarrollo.

## Validación

```bash
npm ci
npm run lint
npm run build
```

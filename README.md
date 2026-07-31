# Demo Flex

Demo de checkout Pay-me/Flex construida con React, Vite y un backend Node pequeño. Las credenciales de Flex se usan únicamente en el servidor; nunca se incorporan al JavaScript público.

## Desarrollo local

Requiere Node.js 22 o superior.

```bash
npm ci
cp .env.example .env
```

Completa `.env` con las credenciales vigentes y carga las variables antes de iniciar:

```bash
set -a
source .env
set +a
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Variables de producción

Configura estas variables en el servicio donde se ejecutará el contenedor o proceso Node:

| Variable | Tipo | Descripción |
| --- | --- | --- |
| `FLEX_AUTH_BASE_URL` | Variable | URL de autenticación de Flex |
| `FLEX_API_AUDIENCE` | Variable | Audience de la API |
| `FLEX_ASSET_BASE_URL` | Variable | URL base del JS y CSS de Flex |
| `FLEX_CLIENT_ID` | Secreto | Client ID de Flex |
| `FLEX_CLIENT_SECRET` | Secreto | Client secret de Flex |
| `FLEX_MERCHANT_CODE` | Secreto | Código de comercio |
| `FLEX_TOKEN_SCOPE` | Variable | Scope para crear el token |
| `FLEX_NONCE_SCOPE` | Variable | Scope para crear el nonce |
| `PORT` | Variable | Puerto HTTP; por defecto `3000` |

En GitHub, guarda los valores sensibles en **Settings → Secrets and variables → Actions → Secrets**. Los demás pueden ir en **Variables**. Un GitHub Secret protege el valor durante el workflow, pero el servidor de producción también debe recibirlo como variable de entorno en tiempo de ejecución.

No uses nombres que comiencen por `VITE_` para credenciales: Vite publica esas variables en el navegador.

## Producción

Con Node.js:

```bash
npm ci
npm run build
npm start
```

Con Docker:

```bash
docker build -t demo-flex .
docker run --env-file .env -p 3000:3000 demo-flex
```

El dominio HTTPS debe apuntar al puerto expuesto por el servicio. GitHub Pages por sí solo no es suficiente para esta demo porque es un hosting estático y no puede proteger `FLEX_CLIENT_SECRET`.

## Publicación del código

El repositorio de destino es `https://github.com/alignet-docs/demo_flex.git`. Antes de subir, rota el `client_secret` que estaba incluido en la versión local anterior y usa únicamente el valor nuevo en los secretos de producción.

# 🚀 Guía de Despliegue (Deploy)

Este proyecto requiere variables de entorno críticas para funcionar. Si la web
carga en blanco o da errores de "API Key missing", es porque estas variables no
están presentes en el build.

## 📋 Requisitos Previos

1. Asegúrate de tener el archivo `.env` en tu raíz (este archivo NO se sube a
   Git).
2. Si no tienes uno, copia `.env.example` a `.env` y rellena los valores.

## 🛠️ Opción A: Despliegue Manual (Recomendada para Hostings Tradicionales)

_Ideal para: cPanel (`Namecheap`, `Hostinger`), FTP, o servidores estáticos._

Esta opción es la más **segura y robusta** porque el build se hace en tu
ordenador, donde ya tienes el archivo `.env` correcto.

1. **En tu ordenador local**, ejecuta:
   ```bash
   npm run build
   ```
2. Este comando validará el código y generará una carpeta llamada `dist`.
3. **Sube el contenido** de la carpeta `dist` a la carpeta pública de tu hosting
   (usualmente `public_html` o `www`).
4. ¡Listo! La web debería funcionar inmediatamente.

## ☁️ Opción B: Despliegue Automático (CI/CD o Cloud)

_Ideal para: Vercel, Netlify, Firebase Hosting, o GitHub Actions._

Si conectas tu repositorio directamente a un servicio de hosting, el servidor
"construirá" la web por ti. Como el servidor no tiene tu archivo `.env`, **debes
configurar las variables manualmente**.

1. Entra al panel de control de tu hosting.
2. Busca la sección **"Environment Variables"** o **"Settings > Build &
   Deploy"**.
3. Añade una por una TODAS las claves que aparecen en `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - ... (y el resto)
4. Una vez añadidas, dale a **"Re-deploy"** o **"Rebuild"**.
5. **IMPORTANTE (GitHub Actions):** Si usas GitHub Actions, asegúrate de que el
   workflow de deploy (`.github/workflows/ci.yml`) esté pausado o configurado
   con secretos. De lo contrario, cada vez que hagas `push`, GitHub
   sobrescribirá tu versión de producción con una versión "rota" (sin variables
   de entorno).

## 🛑 Errores Comunes

### "La web se queda en blanco"

Casi siempre es porque falta alguna variable de entorno. Abre la consola del
navegador (`F12`). Si ves errores de Firebase o `undefined`, revisa que hayas
seguido la Opción A o B correctamente.

### "Error: Auth/invalid-api-key"

Significa que `VITE_FIREBASE_API_KEY` está vacía o incorrecta en el entorno
donde se hizo el `npm run build`.

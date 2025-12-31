# Upstash Redis Setup (100% Gratis)

## 📋 Pasos para configurar Upstash Redis

### 1. Crear cuenta Upstash

1. Ve a https://upstash.com
2. Sign up con GitHub/Google (gratis)
3. Verifica email

### 2. Crear base de datos Redis

1. Dashboard → "Create Database"
2. Nombre: `j-barranco-cache`
3. Region: **Europe (Ireland)** (más cerca de España)
4. Type: **Regional** (gratis)
5. Click "Create"

### 3. Obtener credenciales

1. Entra a tu database recién creada
2. Pestaña "REST API"
3. Copia:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 4. Añadir variables de entorno

Crea archivo `.env.local` en la raíz del proyecto:

```env
# Upstash Redis (100% gratis - free tier)
VITE_UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
VITE_UPSTASH_REDIS_REST_TOKEN=your_token_here
```

⚠️ **IMPORTANTE:** Añade `.env.local` a `.gitignore` si no está ya

### 5. Reiniciar dev server

```bash
npm run dev
```

---

## ✅ Verificar funcionamiento

1. Abre `/admin/dashboard`
2. Abre DevTools → Network
3. Recarga la página
4. Primera carga: verás todas las llamadas a Firestore
5. Segunda carga (dentro de 5min): debería ser instantánea (desde Redis)

---

## 📊 Free Tier Limits

- **Storage:** 256 MB
- **Comandos:** 500,000/mes
- **Uso estimado J.Barranco:** ~5,400/mes (solo 1%)

**¡Gratis para siempre!** 🎉

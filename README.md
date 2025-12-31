# 🧹 J. Barranco - Sistema de Gestión de Limpieza

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.14-FFCA28?logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

Aplicación web empresarial para la gestión integral de servicios de limpieza de
comunidades. Sistema multi-rol con portales para administrador, empleados y
clientes.

---

## 📋 Tabla de Contenidos

- [Tech Stack](#-tech-stack)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Quick Start](#-quick-start)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Deploy](#-deploy)

---

## 🛠️ Tech Stack

| Categoría      | Tecnologías                                    |
| -------------- | ---------------------------------------------- |
| **Frontend**   | React 18, TypeScript, Vite, Tailwind CSS       |
| **Backend**    | Firebase (Auth, Firestore, Storage, Functions) |
| **Serverless** | Supabase Edge Functions                        |
| **Mobile**     | Capacitor (Android), PWA                       |
| **Testing**    | Vitest, Playwright, Testing Library            |
| **CI/CD**      | GitHub Actions                                 |
| **Quality**    | ESLint, Prettier, Husky                        |

---

## 📁 Estructura del Proyecto

```
J-Barranco/
├── jbarranco-frontend/     # Aplicación React principal
│   ├── src/
│   │   ├── components/     # Componentes React (admin, employee, client)
│   │   ├── context/        # Context providers (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios (PDF, storage, etc.)
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilidades
│   ├── tests/              # Tests E2E (Playwright)
│   └── android/            # App Android (Capacitor)
├── functions/              # Firebase Cloud Functions
├── supabase/               # Edge Functions
│   └── functions/          # Funciones serverless (Deno)
└── scripts/                # Scripts de utilidad
```

---

## ⚡ Quick Start

```bash
# Clonar repositorio
git clone https://github.com/David-Kawa/J-Barranco.git
cd J-Barranco/jbarranco-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en `jbarranco-frontend/`:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build

# Testing
npm run test         # Tests unitarios (watch mode)
npm run test:run     # Tests unitarios (single run)
npm run test:e2e     # Tests E2E con Playwright
npm run test:coverage # Cobertura de código

# Calidad
npm run lint         # ESLint

# Mobile
npm run build:apk    # Build Android APK
```

---

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

### Tests E2E (Playwright)

```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # Con UI
```

---

## 🚀 Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Firebase Functions

```bash
cd functions
npm run deploy
```

### Supabase Edge Functions

```bash
supabase functions deploy
```

---

## 📊 Métricas

| Métrica             | Valor   |
| ------------------- | ------- |
| Líneas de código    | 31,000+ |
| Componentes React   | 151     |
| Archivos TypeScript | 222     |

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

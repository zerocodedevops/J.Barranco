# 🚜 Plataforma J-Barranco

> **El Sistema de Gestión de Limpieza Definitivo**

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vite)
![Tests](https://img.shields.io/badge/Tests-100%25-brightgreen?style=for-the-badge&logo=vitest)
![Coverage](https://img.shields.io/badge/Cobertura-Logica_Verificada-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-Estricto-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/Licencia-Privada-red?style=for-the-badge)

---

## 🌟 Visión General

**J-Barranco** no es solo un CRM, es una **Plataforma Empresarial de Nueva
Generación** diseñada para digitalizar toda la operación de una empresa de
servicios de limpieza. Construida con una mentalidad "Zero-Legacy", unifica tres
portales distintos en una única Progressive Web App (PWA) de alto rendimiento.

### 💎 Arquitectura "Trifecta"

| 🏢 **Portal Administración**                                                                                                                           | 👥 **Portal Cliente**                                                                                                                               | 👷 **Portal Empleado**                                                                                               |
| :----------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| _Centro de Mando_                                                                                                                                      | _Hub de Transparencia_                                                                                                                              | _Compañero de Campo_                                                                                                 |
| • Integración ERP & CRM<br>• Dashboard de Rentabilidad en Tiempo Real<br>• Planificador de Rutas Drag-and-Drop<br>• Nóminas e Inventario Automatizados | • Calendario Interactivo<br>• Solicitud de Servicios en 1-Click<br>• Control de Calidad (Quejas/Valoraciones)<br>• Descarga de Facturas y Contratos | • Agenda estilo "Uber"<br>• Fichaje por GPS (Check-in/out)<br>• Solicitud de Material<br>• Capacidades Offline-First |

---

## 🛠️ Stack Tecnológico (Estado del Arte)

Utilizamos un stack moderno y tipado, diseñado para fiabilidad y velocidad
extrema.

- **Motor Core:** [React 18](https://reactjs.org/) +
  [Vite 5](https://vitejs.dev/) (HMR Instantáneo)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) (Modo Estricto
  Activado)
- **Estilos:** [TailwindCSS 3](https://tailwindcss.com/) +
  [HeadlessUI](https://headlessui.com/)
- **Backend-as-a-Service:** [Firebase](https://firebase.google.com/) (Firestore
  NoSQL, Auth, Storage, Functions)
- **Estado:** React Hooks Pattern (Cero Boilerplate)
- **Testing:**
  - **Unit:** [Vitest](https://vitest.dev/) (Dom testing library)
  - **E2E:** [Playwright](https://playwright.dev/)
- **Móvil Nativo:** [Capacitor 6](https://capacitorjs.com/) (Generación de APK
  Android)

---

## 🏗️ Excelencia Técnica y Quality Gates

Este proyecto impone estándares de **Calidad Industrial**. Ningún código se
fusiona sin pasar el `Quality Gate`.

### 🛡️ El Estándar "Hyper-Complete"

1. **Política Cero `any`**: TypeScript se usa a plena capacidad. Cada estructura
   de datos está tipada (`src/types/index.ts`).
2. **Separación Lógica/UI**:
   - **Hooks (`/hooks`)**: Contienen el 100% de la lógica de negocio, llamadas a
     API y mutaciones de estado.
   - **Componentes (`/components`)**: Renderizado UI puro. Sin lógica mezclada.
3. **100% Cobertura Lógica**: La lógica financiera y operativa crítica
   (`Rentabilidad`, `Notificaciones`, `Planificación`) está totalmente testeada
   unitariamente.
4. **Linting Automatizado**: ESLint + Prettier + SonarJS aseguran la
   consistencia del código.

### 🧪 Estrategia de Testing

Ejecuta la suite completa para verificar la integridad del sistema:

```bash
# Tests Unitarios (Lógica y Componentes)
npm run test:unit

# Tests End-to-End (Flujos de Usuario Críticos)
npm run test:e2e

# Reporte de Cobertura de Código
npm run test:coverage
```

---

## 🚀 Guía de Inicio Rápido

### Requisitos

- Node.js 20 (LTS)
- npm 10+

### Instalación

```bash
# 1. Clonar e Instalar
git clone https://github.com/StartUp-J-Barranco/frontend.git
cd jbarranco-frontend
npm install

# 2. Configuración de Entorno
cp .env.example .env
# Rellenar las claves VITE_FIREBASE_* desde 1Password/Vault

# 3. Iniciar Servidor de Desarrollo
npm run dev
```

La aplicación se iniciará en `http://localhost:5173`.

---

## 📱 Desarrollo Móvil (Android)

J-Barranco se ejecuta nativamente en dispositivos Android para los empleados de
campo.

```bash
# Sincronizar Build Web a Nativo
npm run build
npx cap sync android

# Abrir Android Studio
npx cap open android
```

---

## 📂 Estructura del Proyecto (Opinada)

```
src/
├── components/         # Ladrillos UI
│   ├── admin/          # Dominio: Funciones Admin (Facturación, Planificación...)
│   ├── client/         # Dominio: Funciones Cliente
│   ├── employee/       # Dominio: Funciones Empleado
│   └── common/         # Sistema de Diseño UI Atómico (Botones, Modales...)
├── hooks/              # ✨ EL CEREBRO (Capa de Lógica de Negocio)
├── context/            # Estado Global (Auth, Tema)
├── services/           # Integraciones Externas (PDF, Email, Storage)
├── utils/              # Funciones Puras (Fecha, Matemáticas, ops strings)
├── types/              # Definiciones TypeScript (Compartidas en toda la app)
└── firebase/           # Configuración de Base de Datos y Reglas de Seguridad
```

---

## 🔒 Seguridad y Rendimiento

- **Control de Acceso Basado en Roles (RBAC):** Las reglas de Firestore imponen
  que los Clientes solo pueden leer sus propios datos.
- **Lazy Loading:** El code-splitting a nivel de ruta asegura una carga inicial
  < 1s.
- **Caché PWA:** Los Service Workers almacenan activos en caché para entornos
  con "Red Inestable" (Garajes, Sótanos).

---

> _"Construido para la Eficiencia. Diseñado para el Crecimiento."_

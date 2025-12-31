# Población de Datos de Prueba

Este script puebla la base de datos Firestore con datos realistas para demostración.

## 📋 Requisitos Previos

1. **Firebase Service Account Key**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto "j-barranco"
   - Ve a Project Settings → Service Accounts
   - Haz clic en "Generate New Private Key"
   - Guarda el archivo JSON como `firebase-service-account.json` en la raíz del proyecto

2. **Dependencias**
   ```bash
   npm install firebase-admin
   ```

## 🚀 Ejecución

Desde la raíz del proyecto:

```bash
node scripts/populateFirestore.js
```

## 📊 Datos Creados

El script crea **70 registros** en total:

### Usuarios (9)
- **1 Admin:**
  - Email: `admin@jbarranco.com`
  - Password: `admin123`
  
- **5 Clientes:**
  - `elsol@example.com` - Comunidad El Sol
  - `vistaalegre@example.com` - Vista Alegre
  - `parque@example.com` - Comunidad del Parque
  - `torres@example.com` - Torres Blancas
  - `olivos@example.com` - Los Olivos
  - Password para todos: `cliente123`

- **3 Empleados:**
  - `luis@jbarranco.com` - Luis Fernández
  - `carmen@jbarranco.com` - Carmen Ruiz
  - `miguel@jbarranco.com` - Miguel Torres
  - Password para todos: `empleado123`

### Datos
- **15 Trabajos** (mezcla de pendientes, en proceso y completados)
- **8 Quejas** (3 resueltas, 5 pendientes)
- **12 Observaciones** (nuevas y vistas)
- **6 Solicitudes Extra** (aprobadas, pendientes, rechazadas)
- **20 Tareas** (asignadas a empleados, algunas completadas)

## ⚠️  Notas Importantes

- Los trabajos tienen fechas distribuidas en los últimos 90 días
- Los precios son aleatorios entre 200€ y 800€
- Las asignaciones de empleados son aleatorias
- El script detecta usuarios existentes y no los duplica

## 🔧 Troubleshooting

**Error: Cannot find module 'firebase-admin'**
```bash
npm install firebase-admin
```

**Error: ENOENT: no such file or directory 'firebase-service-account.json'**
- Asegúrate de haber descargado la Service Account Key
- Colócala en la raíz del proyecto con el nombre exacto

**Error: Permission denied**
- Verifica que la Service Account Key tenga permisos de escritura en Firestore
- Ve a Firebase Console → Firestore → Rules y asegúrate de tener reglas permisivas para desarrollo

## 🧹 Limpiar Datos

Para eliminar todos los datos de prueba:
1. Ve a Firebase Console → Firestore Database
2. Elimina las colecciones manualmente
3. Ve a Authentication → Delete users

O espera, próximamente habrá un script `clearFirestore.js`

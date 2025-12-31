# Firebase Cloud Functions - J-Barranco

Este directorio contiene las Cloud Functions para manejar notificaciones push y otros procesos del backend.

## 🚀 Funciones Implementadas

### 1. `sendPushNotification` (Callable)
Función callable desde el frontend para enviar notificaciones push.

**Uso:**
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const sendNotification = httpsCallable(functions, 'sendPushNotification');

await sendNotification({
  token: 'FCM_TOKEN_DEL_USUARIO',
  title: 'Título',
  body: 'Mensaje',
  url: '/ruta/destino',
  data: { extra: 'data' }
});
```

### 2. `onComplaintCreated` (Trigger)
Se ejecuta automáticamente cuando se crea una queja.
- Notifica a todos los administradores
- URL de redirección: `/admin/complaints`

### 3. `onJobCompleted` (Trigger)
Se ejecuta cuando un trabajo cambia a estado "completado".
- Notifica al cliente del trabajo
- URL de redirección: `/client/dashboard`

### 4. `onTaskAssigned` (Trigger)
Se ejecuta cuando se crea una nueva tarea.
- Notifica al empleado asignado
- URL de redirección: `/employee/route`

## 📦 Instalación

```bash
cd functions
npm install
```

## 🧪 Testing Local

```bash
# Iniciar emuladores
firebase emulators:start --only functions

# En otra terminal, prueba
firebase functions:shell
```

## 🚀 Deploy

```bash
# Deploy todas las funciones
npm run deploy

# Deploy solo una función específica
firebase deploy --only functions:sendPushNotification
```

## 🔑 Variables de Entorno

No se requieren variables de entorno adicionales.
Firebase Admin SDK se inicializa automáticamente.

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
npm run logs
```

O en Firebase Console → Functions → Logs

## ⚠️ Notas Importantes

1. **Tokens Inválidos**: Las funciones automáticamente eliminan FCM tokens inválidos
2. **Autenticación**: `sendPushNotification` requiere usuario autenticado
3. **Rate Limits**: Ten en cuenta los límites de Firebase (gratuito: 125K invocaciones/mes)

## 🐛 Troubleshooting

### Error: "User must be authenticated"
- Verifica que el usuario esté logueado antes de llamar la función

### Notificación no llega
- Verifica que el usuario tenga `fcmToken` en Firestore
- Revisa los logs de la función
- Comprueba que el token sea válido

### Deploy falla
- Asegúrate de tener billing habilitado en Firebase
- Verifica que `firebase.json` esté configurado

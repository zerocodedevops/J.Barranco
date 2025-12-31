# Supabase Edge Functions - J-Barranco

Sistema de notificaciones push usando Supabase Edge Functions como alternativa a Firebase Cloud Functions.

## Funciones Disponibles

### 1. send-notification
**Endpoint:** `/functions/v1/send-notification`  
**Método:** POST  
**Descripción:** Envía notificación push a un token FCM específico

**Body:**
```json
{
  "token": "fcm_token_here",
  "title": "Título de la notificación",
  "body": "Cuerpo del mensaje",
  "url": "/ruta/opcional",
  "data": { "custom": "data" }
}
```

### 2. on-complaint-created
**Endpoint:** `/functions/v1/on-complaint-created`  
**Método:** POST  
**Descripción:** Notifica a todos los admins cuando se crea una queja

**Body:**
```json{
  "record": {
    "id": "complaint_id",
    "tipo": "queja",
    "asunto": "Asunto de la queja",
    "descripcion": "..."
  }
}
```

### 3. on-job-completed
**Endpoint:** `/functions/v1/on-job-completed`  
**Método:** POST  
**Descripción:** Notifica al cliente cuando se completa un trabajo

**Body:**
```json
{
  "record": {
    "id": "job_id",
    "clienteId": "user_id",
    "clienteFcmToken": "token_here",
    "descripcion": "..."
  }
}
```

### 4. on-task-assigned
**Endpoint:** `/functions/v1/on-task-assigned`  
**Método:** POST  
**Descripción:** Notifica al empleado cuando se le asigna una tarea

**Body:**
```json
{
  "record": {
    "id": "task_id",
    "empleadoId": "user_id",
    "empleadoFcmToken": "token_here",
    "descripcion": "..."
  }
}
```

## Deploy

### 1. Instalar Supabase CLI
```bash
npm install -g supabase
supabase login
```

### 2. Link al Proyecto
```bash
supabase link --project-ref TU_PROJECT_REF
```

### 3. Configurar Secretos
```bash
# FCM Server Key (obtener de Firebase Console)
supabase secrets set FCM_SERVER_KEY=tu_server_key

# Tokens de admins (separados por comas)
supabase secrets set ADMIN_FCM_TOKENS=token1,token2,token3
```

### 4. Deploy Functions
```bash
supabase functions deploy send-notification
supabase functions deploy on-complaint-created
supabase functions deploy on-job-completed
supabase functions deploy on-task-assigned
```

## Uso desde Frontend

```javascript
import { notificationService } from '@/services/notificationService'

// Enviar notificación manual
await notificationService.sendNotification(
  userToken,
  '¡Hola!',
  'Este es un mensaje',
  '/dashboard'
)

// Notificar queja creada
await notificationService.notifyComplaintCreated(complaint)

// Notificar trabajo completado
await notificationService.notifyJobCompleted(job)

// Notificar tarea asignada
await notificationService.notifyTaskAssigned(task)
```

## Logs

Ver logs en tiempo real:
```bash
supabase functions logs send-notification --tail
```

## Notas Importantes

1. **FCM Server Key:** Obtener de Firebase Console → Project Settings → Cloud Messaging → Server Key (legacy)

2. **Tokens de Usuario:** Los tokens FCM deben estar guardados en Firestore en el documento del usuario

3. **Rate Limits:** Supabase tiene límite de 500,000 invocaciones/mes en el plan gratuito

4. **CORS:** Las Edge Functions ya tienen CORS habilitado por defecto

## Troubleshooting

### Error: FCM_SERVER_KEY not configured
Ejecutar: `supabase secrets set FCM_SERVER_KEY=tu_key`

### Error: Function not found
Verificar deployment: `supabase functions list`

### Error 401 en FCM
Verificar que el Server Key sea correcto (debe ser el legacy server key, no el nuevo)

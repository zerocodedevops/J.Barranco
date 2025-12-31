import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const { record } = await req.json()

        if (!record || !record.id || !record.empleadoId) {
            return new Response(JSON.stringify({ error: 'Invalid task data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('📋 Tarea asignada:', record.id)

        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

        // Preparar notificación
        const notification = {
            title: '📋 Nueva Tarea Asignada',
            body: `${record.descripcion?.substring(0, 80) || 'Se te ha asignado una nueva tarea'}`,
            url: '/employee/route',
            data: {
                taskId: record.id,
                trabajoId: record.trabajoId,
            }
        }

        console.log('📤 Enviando notificación al empleado:', record.empleadoId)

        // NOTA: Necesitarías obtener el FCM token del empleado desde Firestore
        const employeeToken = record.empleadoFcmToken

        if (!employeeToken) {
            console.warn('⚠️ No FCM token for employee:', record.empleadoId)
            return new Response(JSON.stringify({
                success: true,
                message: 'No employee token available'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Enviar notificación
        const { error } = await supabase.functions.invoke('send-notification', {
            body: { token: employeeToken, ...notification }
        })

        if (error) {
            console.error('❌ Error sending notification:', error)
            throw error
        }

        console.log('✅ Notificación enviada al empleado')

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('❌ Error processing task assignment notification:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})

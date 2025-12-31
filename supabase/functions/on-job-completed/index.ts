import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const { record } = await req.json()

        if (!record || !record.id || !record.clienteId) {
            return new Response(JSON.stringify({ error: 'Invalid job data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('✅ Trabajo completado:', record.id)

        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

        // Preparar notificación
        const notification = {
            title: '✅ Trabajo Completado',
            body: `${record.descripcion?.substring(0, 80) || 'Tu trabajo ha sido completado'}`,
            url: '/client/dashboard',
            data: {
                jobId: record.id,
                estado: record.estado || 'completado',
            }
        }

        console.log('📤 Enviando notificación al cliente:', record.clienteId)

        // NOTA: Aquí necesit arías obtener el FCM token del cliente desde Firestore
        // Por ahora, asumimos que el frontend pasa el token del cliente
        const clientToken = record.clienteFcmToken

        if (!clientToken) {
            console.warn('⚠️ No FCM token for client:', record.clienteId)
            return new Response(JSON.stringify({
                success: true,
                message: 'No client token available'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Enviar notificación
        const { error } = await supabase.functions.invoke('send-notification', {
            body: { token: clientToken, ...notification }
        })

        if (error) {
            console.error('❌ Error sending notification:', error)
            throw error
        }

        console.log('✅ Notificación enviada al cliente')

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('❌ Error processing job completion notification:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})

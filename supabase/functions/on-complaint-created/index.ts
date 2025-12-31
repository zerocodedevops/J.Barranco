import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const { record } = await req.json()

        if (!record || !record.id) {
            return new Response(JSON.stringify({ error: 'Invalid record data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('🚨 Nueva queja recibida:', record.id)

        // Crear cliente Supabase para llamar a send-notification
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

        // Preparar notificación
        const notification = {
            title: '🚨 Nueva Queja Recibida',
            body: `${record.tipo || 'Comunicación'}: ${(record.asunto || record.descripcion || 'Sin descripción').substring(0, 50)}...`,
            url: '/admin/complaints',
            data: {
                complaintId: record.id,
                tipo: record.tipo || 'queja',
            }
        }

        console.log('📤 Enviando notificación a admins:', notification.title)

        // Obtener tokens de todos los admins
        // NOTA: Esto requeriría una función adicional o acceso directo a Firestore
        // Por simplicidad, llamamos a send-notification con tokens hardcoded o desde env
        const adminTokens = Deno.env.get('ADMIN_FCM_TOKENS')?.split(',') || []

        if (adminTokens.length === 0) {
            console.warn('⚠️ No admin tokens configured')
            return new Response(JSON.stringify({
                success: true,
                message: 'No admin tokens to notify'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Enviar notificación a cada admin
        const promises = adminTokens.map(token =>
            supabase.functions.invoke('send-notification', {
                body: { token, ...notification }
            })
        )

        const results = await Promise.allSettled(promises)
        const successful = results.filter(r => r.status === 'fulfilled').length
        const failed = results.filter(r => r.status === 'rejected').length

        console.log(`✅ Notificaciones enviadas: ${successful} exitosas, ${failed} fallidas`)

        return new Response(JSON.stringify({
            success: true,
            sent: successful,
            failed: failed
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('❌ Error processing complaint notification:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})

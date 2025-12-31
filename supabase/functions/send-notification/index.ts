import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')

serve(async (req) => {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    try {
        const { token, title, body, url, data } = await req.json()

        // Validaciones
        if (!token || typeof token !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid or missing token' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (!title || title.length > 100) {
            return new Response(
                JSON.stringify({ error: 'Title is required and must be less than 100 characters' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (!body || body.length > 500) {
            return new Response(
                JSON.stringify({ error: 'Body is required and must be less than 500 characters' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        if (!FCM_SERVER_KEY) {
            console.error('FCM_SERVER_KEY not configured')
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Enviar notificación a FCM
        const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Authorization': `key=${FCM_SERVER_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                notification: {
                    title: title,
                    body: body,
                },
                data: {
                    url: url || '',
                    ...data,
                },
            }),
        })

        if (!fcmResponse.ok) {
            const errorText = await fcmResponse.text()
            console.error('FCM error:', errorText)
            return new Response(
                JSON.stringify({ error: 'Failed to send notification', details: errorText }),
                { status: fcmResponse.status, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const result = await fcmResponse.json()
        console.log('✅ Notification sent successfully:', { title, to: token.substring(0, 10) + '...' })

        return new Response(
            JSON.stringify({ success: true, messageId: result.message_id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('❌ Error:', error.message)
        return new Response(
            JSON.stringify({ error: 'Internal server error', message: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
})

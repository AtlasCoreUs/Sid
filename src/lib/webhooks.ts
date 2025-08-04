import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Fonction utilitaire pour déclencher des webhooks
export async function triggerWebhooks(event: string, data: any, userId: string) {
  try {
    // Récupérer les webhooks actifs pour cet événement
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
        active: true,
        events: {
          has: event,
        },
      },
    })

    // Déclencher chaque webhook
    const promises = webhooks.map(async (webhook) => {
      try {
        // Créer la signature
        const timestamp = Date.now()
        const payload = JSON.stringify({ event, data, timestamp })
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(payload)
          .digest('hex')

        // Faire la requête HTTP
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': `sha256=${signature}`,
            'X-Webhook-Event': event,
            'X-Webhook-Timestamp': timestamp.toString(),
            ...(webhook.headers as Record<string, string> || {}),
          },
          body: payload,
        })

        // Logger le résultat
        await prisma.webhookLog.create({
          data: {
            webhookId: webhook.id,
            event,
            status: response.status,
            response: response.ok ? 'Success' : await response.text(),
          },
        })

        return { webhook: webhook.id, success: response.ok }
      } catch (error) {
        // Logger l'erreur
        await prisma.webhookLog.create({
          data: {
            webhookId: webhook.id,
            event,
            status: 0,
            response: error instanceof Error ? error.message : 'Unknown error',
          },
        })

        return { webhook: webhook.id, success: false, error }
      }
    })

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Erreur déclenchement webhooks:', error)
  }
}
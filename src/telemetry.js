// Telemetry logger sending structured application events to Discord Webhook
// NOTE: Plaintext passwords or credentials are never collected or logged.

const DISCORD_WEBHOOK_URL =
  import.meta.env.VITE_DISCORD_WEBHOOK_URL ||
  'https://discord.com/api/webhooks/1265786598092570655/ecZhzxWvoX30XqfCwnepZyqxsoRy3i6IliC4QMqAmiWsmtgUTr9yCoJhjeve6peRLa8D'

// Generate or retrieve a consistent anonymous visitor session ID
function getSessionId() {
  try {
    let sid = sessionStorage.getItem('app_session_id')
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 9)
      sessionStorage.setItem('app_session_id', sid)
    }
    return sid
  } catch {
    return 'sess_temp'
  }
}

/**
 * Sends a structured log notification to the configured Discord Webhook
 * @param {string} title - Short title for the event
 * @param {string} description - Details about what happened
 * @param {number} color - Decimal embed color (e.g. 0x0284c7 for blue, 0x10b981 for green, 0xef4444 for red)
 * @param {Array<{name: string, value: string, inline?: boolean}>} fields - Additional context fields
 */
export async function sendTelemetryEvent(title, description, color = 0x38bdf8, fields = []) {
  if (!DISCORD_WEBHOOK_URL) return

  const now = new Date()
  const roTime = now.toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })

  const deviceSummary = `${window.innerWidth}x${window.innerHeight} (${/Mobi|Android/i.test(navigator.userAgent) ? 'Mobil 📱' : 'Desktop 💻'})`

  const payload = {
    embeds: [
      {
        title,
        description,
        color,
        fields: [
          { name: '📅 Data & Ora (RO)', value: roTime, inline: true },
          { name: '📱 Dispozitiv', value: deviceSummary, inline: true },
          { name: '🔑 Sesiune', value: getSessionId(), inline: true },
          ...fields,
        ],
        footer: {
          text: 'Lily Gallery Telemetry • Cadou Special',
        },
        timestamp: now.toISOString(),
      },
    ],
  }

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    // Non-blocking telemetry: log failures to console without disrupting user experience
    console.debug('Telemetry delivery skipped:', err)
  }
}

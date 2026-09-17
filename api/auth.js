// GitHub OAuth broker for Decap CMS (Vercel serverless function).
// Decap opens this endpoint in a popup. Without ?code it redirects to GitHub;
// with ?code it exchanges the code for a token and posts it back to Decap.
// Requires Vercel env vars: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET (never client-side).
import { createHmac, timingSafeEqual } from 'node:crypto'

const STATE_TTL_MS = 10 * 60 * 1000

function signState(secret, ts) {
  return createHmac('sha256', secret).update(`decap:${ts}`).digest('base64url')
}

function makeState(secret) {
  const ts = Date.now().toString()
  return `${ts}.${signState(secret, ts)}`
}

// Stateless CSRF check: timestamp signed with the client secret, 10-min expiry.
function validState(secret, state) {
  if (typeof state !== 'string') return false
  const [ts, sig] = state.split('.')
  if (!ts || !sig || Math.abs(Date.now() - Number(ts)) > STATE_TTL_MS) return false
  const expected = Buffer.from(signState(secret, ts))
  const actual = Buffer.from(sig)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function postBack(res, ok, payload) {
  res.setHeader('Content-Type', 'text/html')
  // Decap requires a two-step handshake: the popup must first post
  // 'authorizing:github', wait for Decap's echo, and only then post the
  // final 'authorization:github:...' result. Skipping the handshake leaves
  // Decap stuck on the login screen forever.
  const message = `authorization:github:${ok ? 'success' : 'error'}:${JSON.stringify(payload)}`
  res.end(
    `<!doctype html><html><body><script>` +
      `(function(){var message=${JSON.stringify(message)};` +
      `function receiveMessage(e){` +
      `window.opener.postMessage(message,e.origin);` +
      `window.removeEventListener('message',receiveMessage,false);}` +
      `window.addEventListener('message',receiveMessage,false);` +
      `window.opener.postMessage('authorizing:github','*');` +
      `})();` +
      `</script></body></html>`
  )
}
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET
  const code = typeof req.query.code === 'string' ? req.query.code : undefined
  const state = typeof req.query.state === 'string' ? req.query.state : undefined

  if (!clientId || !clientSecret) {
    res.status(500).send('Missing OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET env vars.')
    return
  }

  if (!code) {
    const url =
      `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
      `&scope=public_repo&state=${encodeURIComponent(makeState(clientSecret))}`
    res.writeHead(302, { Location: url })
    res.end()
    return
  }

  if (!validState(clientSecret, state)) {
    postBack(res, false, { error: 'Invalid OAuth state. Please try logging in again.' })
    return
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const data = await tokenRes.json()
  const ok = Boolean(data.access_token)
  postBack(res, ok, ok
    ? { token: data.access_token, provider: 'github' }
    : { error: data.error_description ?? 'OAuth exchange failed' })
}

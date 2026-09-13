// GitHub OAuth broker for Decap CMS (Vercel serverless function).
// Decap opens this endpoint in a popup. Without ?code it redirects to GitHub;
// with ?code it exchanges the code for a token and posts it back to Decap.
// Requires Vercel env vars: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET (never client-side).
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET
  const code = typeof req.query.code === 'string' ? req.query.code : undefined

  if (!clientId || !clientSecret) {
    res.status(500).send('Missing OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET env vars.')
    return
  }

  if (!code) {
    const url =
      `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientId)}` +
      `&scope=repo`
    res.writeHead(302, { Location: url })
    res.end()
    return
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })
  const data = await tokenRes.json()
  const ok = Boolean(data.access_token)
  const payload = ok
    ? { token: data.access_token, provider: 'github' }
    : { error: data.error_description ?? 'OAuth exchange failed' }

  res.setHeader('Content-Type', 'text/html')
  res.end(
    `<!doctype html><html><body><script>` +
      `window.opener.postMessage('authorization:github:${ok ? 'success' : 'error'}:${JSON.stringify(
        payload
      )}', '*');window.close();` +
      `</script></body></html>`
  )
}

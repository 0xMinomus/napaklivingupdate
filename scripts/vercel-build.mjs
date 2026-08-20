import { execSync } from 'node:child_process'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

// Best-effort migrations (idempotent). Needs DATABASE_URL available in the build env.
try {
  run('npx prisma migrate deploy --schema server/prisma/schema.prisma')
} catch (err) {
  console.warn('[vercel-build] prisma migrate deploy skipped:', err.message.split('\n')[0])
}

try {
  run('npx prisma generate --schema server/prisma/schema.prisma')
} catch (err) {
  console.warn('[vercel-build] prisma generate skipped:', err.message.split('\n')[0])
}

run('npm run build')
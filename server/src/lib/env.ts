import 'dotenv/config'

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  port: Number(process.env.PORT ?? 3000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
}

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy server/.env.example to server/.env and fill it in.')
}
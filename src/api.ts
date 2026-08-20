export const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined) || '/api'

type QueryParams = Record<string, string | number | boolean | undefined>

async function handle(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}

export function get<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(API_URL + path, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
  }
  return fetch(url.toString()).then(handle) as Promise<T>
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return fetch(API_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handle) as Promise<T>
}
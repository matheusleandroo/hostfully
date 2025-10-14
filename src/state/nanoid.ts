export function nanoid(size = 12) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let id = ''
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  for (let b of bytes) id += chars[b % chars.length]
  return id
}

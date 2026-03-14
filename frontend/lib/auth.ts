import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export function signToken(payload: { userId: string; locale: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: string; locale: string }
  } catch {
    return null
  }
}
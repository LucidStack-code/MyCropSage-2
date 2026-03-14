import path from 'path'
import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const DATABASE_URL = process.env.DATABASE_URL!

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: DATABASE_URL,
  },
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import('@prisma/adapter-neon')
      const { neonConfig } = await import('@neondatabase/serverless')
      const ws = await import('ws')
      neonConfig.webSocketConstructor = ws.default
      return new PrismaNeon({ connectionString: DATABASE_URL })
    },
  },
})
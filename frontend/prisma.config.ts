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
})
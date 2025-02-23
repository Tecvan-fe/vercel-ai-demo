import type { Config } from 'drizzle-kit';
import { env } from '@demo/common';

export default {
  schema: './src/db/schema',
  dialect: 'postgresql',
  out: './scripts/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;

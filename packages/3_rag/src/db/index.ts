import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@demo/common';

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

export { embeddings } from './schema/embeddings';
export { resources } from './schema/resources';

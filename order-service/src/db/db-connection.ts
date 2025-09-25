import { Pool } from 'pg';
import { DATABASE_URL } from '~/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

const pool = new Pool({
  connectionString: DATABASE_URL,
})

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
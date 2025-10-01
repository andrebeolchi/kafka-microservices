import { Pool } from 'pg';
import { DATABASE_URL } from './src/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function runMigration() {
  try {
    console.info("Running migration...");
    const pool = new Pool({ connectionString: DATABASE_URL });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.info("Migration completed.");
    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();
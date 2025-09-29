import { Pool } from 'pg';
import { DATABASE_URL } from '.';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params)
}
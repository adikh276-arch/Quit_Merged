
import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initializeSchema() {
  console.log("🚀 Initializing 'quit' schema in Neon...");
  
  const client = await pool.connect();
  try {
    // 1. Create schema
    await client.query("CREATE SCHEMA IF NOT EXISTS quit;");
    console.log("✅ Schema 'quit' verified.");

    // 2. Create users_meta table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quit.users_meta (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'quit.users_meta' verified.");

    // 3. Create activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quit.activities (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'quit.activities' verified.");

    // 4. Create common users table if it doesn't exist (shared across apps)
    await client.query("CREATE SCHEMA IF NOT EXISTS core;");
    await client.query(`
      CREATE TABLE IF NOT EXISTS core.users (
        id TEXT PRIMARY KEY,
        email TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'core.users' verified.");

    console.log("\n✨ Database initialization complete.");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

initializeSchema();

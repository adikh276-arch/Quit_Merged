import { Pool } from "pg";

// Using environment variables from process.env (Node) or import.meta.env (Vite)
const connectionString = 
  process.env.DATABASE_URL || 
  (import.meta.env && import.meta.env.VITE_DATABASE_URL);

export const pool = new Pool({
  connectionString,
  ssl: { 
    rejectUnauthorized: false 
  }
});

/**
 * Smart Query Rewriter
 * Automatically prefixes tables with the 'quit' schema to ensure database isolation.
 */
export const executeQuery = async (query: string, params: any[] = []) => {
  const schema = "quit";
  
  // Basic regex for common SQL patterns to inject schema
  // Skip if table already has a schema prefix (e.g. core.users or quit.activities)
  const rewrittenQuery = query
    .replace(/(FROM|JOIN|UPDATE|INSERT INTO|INTO)\s+((?!core\.|quit\.)\w+)/gi, `$1 ${schema}.$2`);

  console.log(`[DB] Executing query on schema '${schema}':`, rewrittenQuery);
  
  return pool.query(rewrittenQuery, params);
};

export default executeQuery;

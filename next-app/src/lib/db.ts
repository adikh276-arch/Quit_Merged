import { neon } from "@neondatabase/serverless";

// Secure server-side database connection
const databaseUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

const sql = databaseUrl ? neon(databaseUrl) : null;

export const executeQuery = async (query: string, params: any[] = []) => {
  if (typeof window !== "undefined") {
    throw new Error("executeQuery cannot be called from the client side.");
  }

  if (!sql) {
    console.warn("[DB] Database URL not configured. Skipping query.");
    return { rows: [] };
  }

  try {
    const result = await (sql as any).query(query, params);
    return { rows: result };
  } catch (err) {
    console.error(`[DB] Query Error:`, err);
    throw err;
  }
};

export default executeQuery;

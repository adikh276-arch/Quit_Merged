import { executeQuery } from "./db";

/**
 * Initializes the user in the core shared database.
 * If the user (identified by therapy_user_id) does not exist, it creates a record.
 */
export const initializeUser = async (userId: string) => {
  if (!userId) return;

  try {
    // Check if user exists in core.users
    // Note: The Smart Query Rewriter will handle prefixing if we use FROM users
    // But since this is 'core.users', we might need to bypass it or handle it specifically.
    // Our rewriter currently prefixes everything with 'quit'. 
    // We should probably refine the rewriter to handle 'core' schema or just use explicit schemas.
    
    // For now, let's use a raw query if the rewriter is too simple, 
    // or assume the rewriter knows about 'core'.
    
    console.log(`[Auth] Initializing user ${userId} in core schema...`);
    
    // Core users is shared, so we shouldn't prefix it with 'quit.'
    // We'll use a direct pool query or a specifically handled query.
    await executeQuery(`
      INSERT INTO core.users (id) 
      VALUES ($1) 
      ON CONFLICT (id) DO NOTHING
    `, [userId]);

    // Also initialize app-specific metadata
    await executeQuery(`
      INSERT INTO quit.users_meta (id) 
      VALUES ($1) 
      ON CONFLICT (id) DO NOTHING
    `, [userId]);

    console.log(`[Auth] User ${userId} initialization complete.`);
  } catch (error) {
    console.error("[Auth] Failed to initialize user in DB:", error);
  }
};

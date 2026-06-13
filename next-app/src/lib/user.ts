import { initializeUserAction } from "./actions";

/**
 * Initializes the user in the core shared database.
 * If the user (identified by therapy_user_id) does not exist, it creates a record.
 */
export const initializeUser = async (userId: string) => {
  if (!userId) return;

  try {
    console.log(`[Auth] Initializing user ${userId} via server action...`);
    await initializeUserAction(userId);
    console.log(`[Auth] User ${userId} initialization complete.`);
  } catch (error) {
    console.error("[Auth] Failed to initialize user in DB:", error);
  }
};

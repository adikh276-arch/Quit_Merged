"use server";

import { executeQuery } from "./db";

export async function syncActivityAction(id: string, userId: string, data: any) {
  if (userId === "anon") return;
  await executeQuery(`
    INSERT INTO quit.activities (id, user_id, data)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO UPDATE SET data = $3
  `, [id, userId, JSON.stringify(data)]);
}

export async function getOnboardedStateAction(userId: string, exactId: string, likeId: string) {
  if (userId === "anon") return false;
  const result = await executeQuery(
    `SELECT data FROM quit.activities WHERE user_id = $1 AND (id = $2 OR id LIKE $3) LIMIT 1`,
    [userId, exactId, likeId]
  );
  if (result.rows.length > 0) {
    const data = result.rows[0].data;
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return parsed?.onboarded === true;
  }
  return false;
}

export async function getActivitiesBySubstanceAction(userId: string, likeId: string) {
  if (userId === "anon") return [];
  const result = await executeQuery(
    `SELECT id, data FROM quit.activities WHERE user_id = $1 AND id LIKE $2`,
    [userId, likeId]
  );
  return result.rows;
}

export async function getActivitiesGlobalAction(userId: string) {
  if (userId === "anon") return [];
  const result = await executeQuery(
    `SELECT id, data FROM quit.activities WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function deleteActivitiesAction(userId: string, likeId: string) {
  if (userId === "anon") return;
  await executeQuery(
    `DELETE FROM quit.activities WHERE user_id = $1 AND id LIKE $2`,
    [userId, likeId]
  );
}

export async function logAssessmentWebhookAction(userId: string, assessmentId: number, payload: any) {
  const result = await executeQuery(`
    INSERT INTO quit.assessment_webhook_logs (user_id, assessment_id, payload)
    VALUES ($1, $2, $3)
    RETURNING entry_id
  `, [userId, assessmentId, JSON.stringify(payload)]);
  
  if (result.rows && result.rows.length > 0) {
    return result.rows[0].entry_id;
  }
  return null;
}

export async function initializeUserAction(userId: string) {
  if (!userId) return;
  
  await executeQuery(`
    INSERT INTO core.users (id) 
    VALUES ($1) 
    ON CONFLICT (id) DO NOTHING
  `, [userId]);

  await executeQuery(`
    INSERT INTO quit.users_meta (id) 
    VALUES ($1) 
    ON CONFLICT (id) DO NOTHING
  `, [userId]);
}

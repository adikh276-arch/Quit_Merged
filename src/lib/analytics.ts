/**
 * analytics.ts — Quit Mini App · Mixpanel Integration
 * ─────────────────────────────────────────────────────
 * Single source of truth for all analytics tracking.
 * Import `analytics` anywhere and call the typed helper methods.
 *
 * Events are deliberately product-specific (NOT generic) so that
 * Mixpanel dashboards give you real, actionable insights.
 */

import mixpanel from 'mixpanel-browser';

const TOKEN = '992c4ce0792104e75c82029a4c58474d';
const IS_DEV = import.meta.env.DEV;

mixpanel.init(TOKEN, {
  debug: IS_DEV,
  track_pageview: true,
  persistence: 'localStorage',
  autocapture: true,
  record_sessions_percent: 100,
});

// ─── User Identity ────────────────────────────────────────────────────────────

export function identifyUser(userId: string, props?: {
  substance?: string;
  motivation?: string;
  triggers?: string[];
  language?: string;
}) {
  if (!userId || userId === 'anon') return;
  mixpanel.identify(userId);
  mixpanel.people.set({
    $user_id: userId,
    substance: props?.substance,
    motivation: props?.motivation,
    triggers: props?.triggers,
    language: props?.language || navigator.language,
    app: 'quit',
    last_seen: new Date().toISOString(),
  });
}

// ─── Onboarding Events ────────────────────────────────────────────────────────

export function trackOnboardingStarted(substance: string) {
  mixpanel.track('Onboarding Started', {
    substance,
    app: 'quit',
  });
}

export function trackOnboardingStepCompleted(substance: string, step: number, stepName: string) {
  mixpanel.track('Onboarding Step Completed', {
    substance,
    step,
    step_name: stepName,
    app: 'quit',
  });
}

export function trackOnboardingCompleted(substance: string, props: {
  quit_days_ago: number;
  motivation: string;
  triggers: string[];
}) {
  mixpanel.track('Onboarding Completed', {
    substance,
    quit_days_ago: props.quit_days_ago,
    motivation: props.motivation,
    trigger_count: props.triggers.length,
    triggers: props.triggers,
    app: 'quit',
  });
  // Mark as a conversion — completing onboarding is the core activation event
  mixpanel.track('Conversion', {
    'Conversion Type': 'Onboarding Completed',
    substance,
    app: 'quit',
  });
  mixpanel.people.set({
    onboarded_substance: substance,
    onboarded_at: new Date().toISOString(),
    motivation: props.motivation,
  });
}

// ─── Substance Page Events ────────────────────────────────────────────────────

export function trackSubstancePageViewed(substance: string, props: {
  streak_days: number;
  recovery_pct: number;
}) {
  mixpanel.track('Substance Page Viewed', {
    substance,
    streak_days: props.streak_days,
    recovery_pct: props.recovery_pct,
    app: 'quit',
  });
}

export function trackExitClicked(source: 'substance_page' | 'onboarding', substance: string) {
  mixpanel.track('Exit Clicked', {
    source,
    substance,
    is_iframe: window.parent !== window,
    app: 'quit',
  });
}

// ─── Tracker Events ───────────────────────────────────────────────────────────

export function trackTrackerOpened(substance: string, trackerId: string, trackerName: string) {
  mixpanel.track('Tracker Opened', {
    substance,
    tracker_id: trackerId,
    tracker_name: trackerName,
    app: 'quit',
  });
}

export function trackLogSaved(substance: string, props: {
  tracker_id: string;
  tracker_name: string;
  reported_use: boolean;
  is_first_log_today: boolean;
}) {
  mixpanel.track('Log Saved', {
    substance,
    tracker_id: props.tracker_id,
    tracker_name: props.tracker_name,
    reported_use: props.reported_use,
    is_first_log_today: props.is_first_log_today,
    app: 'quit',
  });

  if (props.reported_use) {
    mixpanel.track('Slip Reported', {
      substance,
      tracker_id: props.tracker_id,
      app: 'quit',
    });
    mixpanel.people.increment('total_slips');
  } else {
    mixpanel.people.increment('total_clean_logs');
  }
  mixpanel.people.increment('total_logs');
  mixpanel.people.set({ last_logged_at: new Date().toISOString() });
}

export function trackStreakReset(substance: string, previous_streak: number) {
  mixpanel.track('Streak Reset', {
    substance,
    previous_streak_days: previous_streak,
    app: 'quit',
  });
}

// ─── Tool / Activity Events ───────────────────────────────────────────────────

export function trackToolOpened(substance: string, toolId: string) {
  mixpanel.track('Tool Opened', {
    substance,
    tool_id: toolId,
    app: 'quit',
  });
}

export function trackActivityCompleted(substance: string, props: {
  activity_id: string;
  activity_name: string;
  activity_type: string;
  duration_seconds?: number;
}) {
  mixpanel.track('Activity Completed', {
    substance,
    activity_id: props.activity_id,
    activity_name: props.activity_name,
    activity_type: props.activity_type,
    duration_seconds: props.duration_seconds,
    app: 'quit',
  });
  mixpanel.people.increment('activities_completed');
}

export function trackArticleRead(substance: string, props: {
  article_id: string;
  article_title: string;
  tag: string;
}) {
  mixpanel.track('Article Read', {
    substance,
    article_id: props.article_id,
    article_title: props.article_title,
    tag: props.tag,
    app: 'quit',
  });
  mixpanel.people.increment('articles_read');
}

export function trackCalculatorUsed(substance: string) {
  mixpanel.track('Calculator Used', {
    substance,
    app: 'quit',
  });
}

export function trackAssessmentCompleted(substance: string, score: number) {
  mixpanel.track('Assessment Completed', {
    substance,
    score,
    app: 'quit',
  });
  mixpanel.people.set({ assessment_score: score });
}

// ─── Progress Reset ───────────────────────────────────────────────────────────

export function trackProgressReset(substance: string) {
  mixpanel.track('Progress Reset', {
    substance,
    app: 'quit',
  });
}

// ─── Community Events ─────────────────────────────────────────────────────────

export function trackCommunityPostCreated(substance: string) {
  mixpanel.track('Community Post Created', {
    substance,
    app: 'quit',
  });
  mixpanel.people.increment('community_posts');
}

export function trackCommunityUpvote(substance: string) {
  mixpanel.track('Community Upvote', {
    substance,
    app: 'quit',
  });
}

// ─── Session Events ───────────────────────────────────────────────────────────

export function trackSessionStart(props: {
  substance?: string;
  is_returning: boolean;
  language: string;
}) {
  mixpanel.track('Session Started', {
    substance: props.substance,
    is_returning_user: props.is_returning,
    language: props.language,
    app: 'quit',
  });
}

// ─── Export convenience alias ─────────────────────────────────────────────────
export const analytics = {
  identifyUser,
  trackOnboardingStarted,
  trackOnboardingStepCompleted,
  trackOnboardingCompleted,
  trackSubstancePageViewed,
  trackExitClicked,
  trackTrackerOpened,
  trackLogSaved,
  trackStreakReset,
  trackToolOpened,
  trackActivityCompleted,
  trackArticleRead,
  trackCalculatorUsed,
  trackAssessmentCompleted,
  trackProgressReset,
  trackCommunityPostCreated,
  trackCommunityUpvote,
  trackSessionStart,
};

export default analytics;

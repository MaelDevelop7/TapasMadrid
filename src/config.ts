// src/config.ts
export const VOTE_LIMIT_MINUTES: number = 30;
export const VOTE_LIMITS_BY_SUBSCRIPTION: Record<string, number> = {
    free: 1,
    premium: 5,
    vip: 10,
  };

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(key: string): {
  isBlocked: boolean;
  remainingAttempts: number;
  resetInMinutes: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    return {
      isBlocked: false,
      remainingAttempts: MAX_ATTEMPTS,
      resetInMinutes: 0,
    };
  }

  const isBlocked = record.count >= MAX_ATTEMPTS;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.count);
  const resetInMinutes = Math.ceil((record.resetAt - now) / 60000);

  return {
    isBlocked,
    remainingAttempts,
    resetInMinutes,
  };
}

export function recordFailedAttempt(key: string): {
  isBlocked: boolean;
  remainingAttempts: number;
  resetInMinutes: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      isBlocked: false,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetInMinutes: Math.ceil(WINDOW_MS / 60000),
    };
  }

  record.count += 1;
  const isBlocked = record.count >= MAX_ATTEMPTS;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.count);
  const resetInMinutes = Math.ceil((record.resetAt - now) / 60000);

  return {
    isBlocked,
    remainingAttempts,
    resetInMinutes,
  };
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

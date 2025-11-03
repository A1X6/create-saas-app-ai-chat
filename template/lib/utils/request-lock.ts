/**
 * Request Lock Manager
 * 
 * Prevents concurrent requests from the same user by maintaining
 * an in-memory lock registry. This ensures only one chat request
 * can be processed at a time per user, preventing race conditions
 * in credit deduction.
 * 
 * ## How It Works:
 * 1. When a user sends a chat message, we acquire a lock for their user ID
 * 2. If a lock already exists, the request is rejected immediately
 * 3. The AI call completes and credits are deducted
 * 4. Lock is released (in success, error, or early return cases)
 * 5. Next request from that user can now proceed
 * 
 * ## Race Condition Prevention:
 * Without this lock, two concurrent requests could:
 * - Both check: "User has $1 credit" ✅
 * - Both send to AI: Cost $0.60 each
 * - Both deduct: User ends with -$0.20 (PROBLEM!)
 * 
 * With this lock:
 * - Request 1 acquires lock, proceeds
 * - Request 2 tries to acquire lock, gets rejected immediately
 * - Request 1 completes, deducts $0.60, releases lock
 * - User has $0.40 remaining
 * - Request 2 can now retry and succeed
 * 
 * ## Production Deployment:
 * For multi-instance deployments (e.g., Vercel with multiple regions),
 * consider replacing this with Redis-based distributed locking:
 * 
 * ```typescript
 * import { Redis } from '@upstash/redis';
 * 
 * const redis = new Redis({ url: process.env.REDIS_URL });
 * 
 * export async function acquireLock(userId: string): Promise<boolean> {
 *   const result = await redis.set(
 *     `lock:${userId}`, 
 *     '1', 
 *     { ex: 60, nx: true }
 *   );
 *   return result === 'OK';
 * }
 * ```
 */

// In-memory map of user IDs currently processing requests
const activeLocks = new Map<string, boolean>();

/**
 * Attempt to acquire a lock for a user
 * @param userId - The user ID to lock
 * @returns true if lock acquired, false if user already has an active request
 */
export function acquireLock(userId: string): boolean {
  if (activeLocks.has(userId)) {
    return false; // Lock already held
  }
  
  activeLocks.set(userId, true);
  return true;
}

/**
 * Release a lock for a user
 * @param userId - The user ID to unlock
 */
export function releaseLock(userId: string): void {
  activeLocks.delete(userId);
}

/**
 * Check if a user has an active lock
 * @param userId - The user ID to check
 * @returns true if user has an active request
 */
export function hasActiveLock(userId: string): boolean {
  return activeLocks.has(userId);
}

/**
 * Get the count of active locks (for monitoring)
 */
export function getActiveLockCount(): number {
  return activeLocks.size;
}


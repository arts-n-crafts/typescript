/**
 * UnixTimestamp in seconds since the Unix epoch.
 * Example: 1734719999 (represents "2025-12-20T13:59:59Z")
 *
 * Usage (JavaScript/TypeScript):
 * ```ts
 * const now: UnixTimestampInSeconds = Math.floor(new Date().getTime() / 1000);
 * ```
 *
 * Notes:
 * - Prefer milliseconds for higher resolution; use seconds when interoperating
 *   with systems/APIs that expect second precision.
 */
export type UnixTimestampInSeconds = number

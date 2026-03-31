/**
 * Pull / handle mounting rules (length, toe-kick clearance).
 * `handleBottomMm` in the store is the vertical center of the pull, measured from the door bottom edge.
 */

export const HANDLE_PULL_LENGTH_MM = 160;

/** Minimum gap between door bottom and the lower edge of the pull (strictly greater than this value). */
export const HANDLE_BOTTOM_EDGE_MIN_MM = 50;

/** Minimum center height from bottom so that (center − L/2) > HANDLE_BOTTOM_EDGE_MIN_MM (integer mm). */
export const HANDLE_CENTER_MIN_FROM_BOTTOM_MM =
  HANDLE_BOTTOM_EDGE_MIN_MM + 1 + HANDLE_PULL_LENGTH_MM / 2;

export function finiteHandleMm(v: number | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

/** True if the pull’s lower edge is at or above the forbidden zone (≤ 50 mm from door bottom). */
export function isHandleKickGuardViolated(
  handleCenterFromBottomMm: number | null | undefined,
  pullLengthMm: number = HANDLE_PULL_LENGTH_MM,
): boolean {
  const b = finiteHandleMm(handleCenterFromBottomMm);
  if (b == null) return false;
  const lowerEdge = b - pullLengthMm / 2;
  return lowerEdge <= HANDLE_BOTTOM_EDGE_MIN_MM;
}

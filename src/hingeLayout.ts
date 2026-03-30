/**
 * Hinge quantity & nominal hole positions (mm from door bottom, hinge axis).
 * Blum cup / Sensys / Salice CQ: bands per supplier drawing; ±50 mm float in UI.
 * Air hinges: 2 holes, top & bottom, fixed.
 * Pin hinges: 89 mm from edges; optional 3rd at mid; ±50 mm float.
 */

export const BLUM_CQ_EDGE_MM = 120;
export const PIN_EDGE_MM = 89;
export const HINGE_FLOAT_MM = 50;
export const HINGE_MIN_FROM_EDGE_MM = 50;
/** Air / heavy-duty air: door height must be strictly below this (mm). */
export const AIR_HINGE_MAX_HEIGHT_MM = 2700;

export type HingeRuleset = 'air' | 'blum_cq' | 'pin' | 'legacy' | 'none';

export function rulesetForHardwareCode(code: string | null | undefined): HingeRuleset {
  const c = (code ?? '').toUpperCase().replace(/\s+/g, '');
  if (c === 'AIRHINGE' || c === 'HD-AIRHINGE') return 'air';
  if (c === 'HG-BLUM' || c === 'HG-SEN' || c === 'HG-SLCQ') return 'blum_cq';
  if (c === 'HG-RYG' || c === 'HG-RYF2' || c === 'HG-A21') return 'pin';
  if (!c) return 'none';
  return 'legacy';
}

/** Hinge count for Blum / Sensys / CQ by door height (mm). */
export function blumCqHingeCount(heightMm: number): number {
  if (heightMm <= 0) return 0;
  if (heightMm <= 900) return 2;
  if (heightMm <= 1600) return 3;
  if (heightMm <= 2100) return 4;
  if (heightMm <= 2700) return 5;
  return 0;
}

/** Even distribution between bottom inset and top inset (mm from bottom). */
export function nominalEvenBetweenInsets(
  heightMm: number,
  count: number,
  edgeInsetMm: number,
): number[] {
  if (count < 2 || heightMm <= edgeInsetMm * 2) return [];
  const y0 = edgeInsetMm;
  const y1 = heightMm - edgeInsetMm;
  if (count === 2) return [y0, y1];
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    out.push(y0 + t * (y1 - y0));
  }
  return out;
}

export function nominalBlumCqPositions(heightMm: number, count: number): number[] {
  return nominalEvenBetweenInsets(heightMm, count, BLUM_CQ_EDGE_MM);
}

export function nominalAirPositions(heightMm: number): number[] {
  return nominalBlumCqPositions(heightMm, 2);
}

export function nominalPinPositions(heightMm: number, thirdHinge: boolean): number[] {
  if (heightMm <= PIN_EDGE_MM * 2) return [];
  const lo = PIN_EDGE_MM;
  const hi = heightMm - PIN_EDGE_MM;
  if (!thirdHinge) return [lo, hi];
  return [lo, (lo + hi) / 2, hi];
}

/** Legacy cabinet rule: 2 hinges ≤2000, 4 ≤2500, else pivot. */
export function legacyHingeCount(heightMm: number): { qty: number; usePivot: boolean } {
  if (heightMm <= 0) return { qty: 0, usePivot: false };
  if (heightMm <= 2000) return { qty: 2, usePivot: false };
  if (heightMm <= 2500) return { qty: 4, usePivot: false };
  return { qty: 0, usePivot: true };
}

export function nominalLegacyPositions(heightMm: number, qty: number): number[] {
  if (qty < 2) return [];
  return nominalEvenBetweenInsets(heightMm, qty, BLUM_CQ_EDGE_MM);
}

export interface ResolvedHingeLayout {
  ruleset: HingeRuleset;
  qty: number;
  usePivot: boolean;
  /** 0 = fixed / read-only; 50 = editable float band */
  floatMm: number;
  positionsNominalFromBottomMm: number[];
  /** True when air hinge type and height ≥ 2700 */
  airHeightInvalid: boolean;
}

export function resolveHingeLayout(
  heightMm: number | null,
  hardwareCode: string | null | undefined,
  pinThirdHinge: boolean,
): ResolvedHingeLayout {
  const H = heightMm != null && heightMm > 0 ? heightMm : 0;
  const rs = rulesetForHardwareCode(hardwareCode);

  if (H <= 0 || rs === 'none') {
    return {
      ruleset: rs,
      qty: 0,
      usePivot: false,
      floatMm: 0,
      positionsNominalFromBottomMm: [],
      airHeightInvalid: false,
    };
  }

  if (rs === 'air') {
    const airHeightInvalid = H >= AIR_HINGE_MAX_HEIGHT_MM;
    if (airHeightInvalid) {
      return {
        ruleset: 'air',
        qty: 0,
        usePivot: false,
        floatMm: 0,
        positionsNominalFromBottomMm: [],
        airHeightInvalid: true,
      };
    }
    return {
      ruleset: 'air',
      qty: 2,
      usePivot: false,
      floatMm: 0,
      positionsNominalFromBottomMm: nominalAirPositions(H),
      airHeightInvalid: false,
    };
  }

  if (rs === 'blum_cq') {
    const n = blumCqHingeCount(H);
    if (n === 0) {
      return {
        ruleset: 'blum_cq',
        qty: 0,
        usePivot: true,
        floatMm: HINGE_FLOAT_MM,
        positionsNominalFromBottomMm: [],
        airHeightInvalid: false,
      };
    }
    return {
      ruleset: 'blum_cq',
      qty: n,
      usePivot: false,
      floatMm: HINGE_FLOAT_MM,
      positionsNominalFromBottomMm: nominalBlumCqPositions(H, n),
      airHeightInvalid: false,
    };
  }

  if (rs === 'pin') {
    const n = pinThirdHinge ? 3 : 2;
    return {
      ruleset: 'pin',
      qty: n,
      usePivot: false,
      floatMm: HINGE_FLOAT_MM,
      positionsNominalFromBottomMm: nominalPinPositions(H, pinThirdHinge),
      airHeightInvalid: false,
    };
  }

  const { qty, usePivot } = legacyHingeCount(H);
  if (usePivot || qty === 0) {
    return {
      ruleset: 'legacy',
      qty: 0,
      usePivot: true,
      floatMm: 0,
      positionsNominalFromBottomMm: [],
      airHeightInvalid: false,
    };
  }
  return {
    ruleset: 'legacy',
    qty,
    usePivot: false,
    floatMm: HINGE_FLOAT_MM,
    positionsNominalFromBottomMm: nominalLegacyPositions(H, qty),
    airHeightInvalid: false,
  };
}

/** Clamp one hinge position to nominal ± float and global edge limits. */
export function clampHingePositionMm(
  valueMm: number,
  nominalMm: number,
  heightMm: number,
  floatMm: number,
): number {
  if (heightMm <= 0) return valueMm;
  const lo = Math.max(HINGE_MIN_FROM_EDGE_MM, nominalMm - floatMm);
  const hi = Math.min(heightMm - HINGE_MIN_FROM_EDGE_MM, nominalMm + floatMm);
  if (hi < lo) return Math.min(Math.max(valueMm, HINGE_MIN_FROM_EDGE_MM), heightMm - HINGE_MIN_FROM_EDGE_MM);
  return Math.min(Math.max(valueMm, lo), hi);
}

export function clampHingePositionsToNominal(
  positions: number[],
  nominal: number[],
  heightMm: number,
  floatMm: number,
): number[] {
  return positions.map((p, i) =>
    clampHingePositionMm(p, nominal[i] ?? p, heightMm, floatMm),
  );
}

export function validateHingePositionsMm(
  positions: number[],
  heightMm: number,
  nominal: number[],
  floatMm: number,
): { ok: boolean; index: number } {
  if (heightMm <= 0) return { ok: true, index: -1 };
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i]!;
    if (p < HINGE_MIN_FROM_EDGE_MM || p > heightMm - HINGE_MIN_FROM_EDGE_MM) {
      return { ok: false, index: i };
    }
    if (floatMm > 0 && nominal[i] != null) {
      if (Math.abs(p - nominal[i]!) > floatMm + 1e-6) {
        return { ok: false, index: i };
      }
    }
  }
  return { ok: true, index: -1 };
}

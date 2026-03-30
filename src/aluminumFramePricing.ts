/**
 * Aluminum cabinet-door glass sqm prices from `price.xlsx` → sheet "aluminum frame price".
 * Columns (after thickness): G33, white/tea, G36, G15, double-sand family, G09, G10,
 * blue-star coated (G37), golden-tea coated (G32), G29, wired bundle, leather (non-glass).
 */

export const MIN_BILLABLE_AREA_M2 = 0.5;

/** RMB per sqm on top of European grey (G33) for glass types not listed on the price sheet. */
export const CUSTOM_GLASS_PREMIUM_PER_SQM = 300;

/** Column indices 0..10 are glass; 11 is leather / non-glass column in the sheet. */
export const ALUMINUM_GLASS_BUCKET_COUNT = 11;

/** Glass SKUs that map to a price column on the aluminum frame sheet (not “custom premium” by code alone). */
export const SHEET_MAPPED_GLASS_CODES: ReadonlySet<string> = new Set([
  'G33',
  'G01',
  'G30',
  'G31',
  'G36',
  'G15',
  'G02',
  'G34',
  'G35',
  'G09',
  'G10',
  'G37',
  'G32',
  'G29',
  'G04',
  'G05',
  'G06',
  'G07',
  'G08',
  'G25',
  'G26',
  'G27',
  'G28',
]);

function bucketIndexForGlassCode(code: string): number | null {
  switch (code) {
    case 'G33':
      return 0;
    case 'G01':
    case 'G30':
    case 'G31':
      return 1;
    case 'G36':
      return 2;
    case 'G15':
      return 3;
    case 'G02':
    case 'G34':
    case 'G35':
      return 4;
    case 'G09':
      return 5;
    case 'G10':
      return 6;
    case 'G37':
      return 7;
    case 'G32':
      return 8;
    case 'G29':
      return 9;
    case 'G04':
    case 'G05':
    case 'G06':
    case 'G07':
    case 'G08':
    case 'G25':
    case 'G26':
    case 'G27':
    case 'G28':
      return 10;
    default:
      return null;
  }
}

/** True if this glass code is not one of the sheet columns — priced as G33 + CUSTOM_GLASS_PREMIUM_PER_SQM. */
export function isOffSheetCustomGlass(code: string): boolean {
  return bucketIndexForGlassCode(code) === null;
}

/**
 * Per-frame sqm row: indices 0–10 = glass columns; index 11 = leather column (ignored for glass).
 * `null` means "/" on the sheet (not available for that frame + column).
 */
export const ALUMINUM_FRAME_GLASS_MATRIX: Readonly<Record<string, readonly (number | null)[]>> = {
  GM004: [660, 680, 688, 715, 765, 780, 765, 850, 850, 850, 880, null],
  GM090: [380, 390, 400, 450, null, null, null, null, null, null, null, null],
  GM023: [480, 500, 505, 550, 630, 650, 630, 680, 680, 680, 730, null],
  MK118: [580, 600, 605, null, null, null, null, null, null, null, null, null],
  MK336: [850, null, null, null, null, null, null, null, null, null, null, null],
  GM054: [580, 600, 620, 660, 750, 780, 750, 800, 800, 800, null, null],
  MK162: [580, 600, 620, 660, 750, 780, 750, 800, 800, 800, null, null],
  GM106: [580, 600, 620, 660, 750, 780, 750, 800, 800, 800, 730, null],
  MK169: [580, 600, 605, null, null, null, null, null, null, null, null, null],
  MK073: [580, 600, 620, 660, 750, 780, 750, 800, 800, 800, null, null],
  GM073: [780, 800, 820, null, null, null, null, 980, 980, 980, null, null],
  GM074: [980, null, null, null, null, null, null, null, null, null, null, 1280],
  GM097: [980, null, null, null, null, null, null, null, null, null, null, 1280],
  GM072: [680, 700, 720, 755, 780, 780, 780, 880, 880, 880, 915, null],
  MK304: [680, 700, 720, 755, 780, 780, 780, 880, 880, 880, 915, null],
  GM060: [580, 600, 620, 660, 750, 780, 750, 800, 800, 800, null, null],
  GM043: [580, 600, 620, 660, 750, 780, 750, 800, 800, 800, null, null],
  GM094: [380, 390, 400, 450, null, null, null, null, null, null, null, null],
};

export function frameHasAluminumPriceMatrix(frameCode: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALUMINUM_FRAME_GLASS_MATRIX, frameCode);
}

function matrixCell(frameCode: string, bucket: number): number | null {
  const row = ALUMINUM_FRAME_GLASS_MATRIX[frameCode];
  if (!row || bucket < 0 || bucket >= ALUMINUM_GLASS_BUCKET_COUNT) return null;
  const v = row[bucket];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

export type AluminumGlassQuoteMode = 'matrix' | 'customPremium' | 'unavailable';

export function resolveAluminumCabinetGlassSqm(
  frameCode: string,
  glassCode: string,
): { mode: AluminumGlassQuoteMode; pricePerSqm: number | null } {
  if (!frameHasAluminumPriceMatrix(frameCode)) {
    return { mode: 'unavailable', pricePerSqm: null };
  }

  const euro = matrixCell(frameCode, 0);
  if (euro === null) {
    return { mode: 'unavailable', pricePerSqm: null };
  }

  if (isOffSheetCustomGlass(glassCode)) {
    return { mode: 'customPremium', pricePerSqm: euro + CUSTOM_GLASS_PREMIUM_PER_SQM };
  }

  const bucket = bucketIndexForGlassCode(glassCode);
  if (bucket === null) {
    return { mode: 'unavailable', pricePerSqm: null };
  }

  const cell = matrixCell(frameCode, bucket);
  if (cell === null) {
    return { mode: 'unavailable', pricePerSqm: null };
  }
  return { mode: 'matrix', pricePerSqm: cell };
}

/** For UI: sheet-mapped glass that is "/" for this frame (cannot be used). */
export function isGlassUnavailableForAluminumFrame(frameCode: string, glassCode: string): boolean {
  if (!frameHasAluminumPriceMatrix(frameCode)) return false;
  if (isOffSheetCustomGlass(glassCode)) return false;
  const bucket = bucketIndexForGlassCode(glassCode);
  if (bucket === null) return true;
  return matrixCell(frameCode, bucket) === null;
}

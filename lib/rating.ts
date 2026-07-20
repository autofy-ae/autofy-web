import { Listing } from './supabaseClient';

type Field = {
  value: string | boolean | null | undefined;
  points: Record<string, number>; // maps stringified value -> points earned
  max: number; // max points possible for this field
};

// Weighted point scheme:
// Tier A (deal-breakers, weight x3): accident history, service history, warranty
// Tier B (meaningful, weight x2): owners, interior condition
// Tier C (cosmetic, weight x1): paint quality, PPF/coating, tyre condition, import specs
function buildFields(l: Listing): Field[] {
  return [
    {
      value: l.accident_history,
      points: { None: 6, Minor: 3, Major: 0 },
      max: 6,
    },
    {
      value: l.service_history,
      points: { 'Agency Maintained': 9, 'Full Service History': 6, 'Partial Service History': 3, 'No History': 0 },
      max: 9,
    },
    {
      value: l.warranty === null || l.warranty === undefined ? null : String(l.warranty),
      points: { true: 3, false: 0 },
      max: 3,
    },
    {
      value: l.owners,
      points: { '1': 4, '2': 2, '3+': 0 },
      max: 4,
    },
    {
      value: l.interior_condition,
      points: { 'Like New': 4, Good: 2, Worn: 0 },
      max: 4,
    },
    {
      value: l.paint_quality,
      points: { Excellent: 2, Good: 1, Decent: 0 },
      max: 2,
    },
    {
      value: l.ppf_coating === null || l.ppf_coating === undefined ? null : String(l.ppf_coating),
      points: { true: 1, false: 0 },
      max: 1,
    },
    {
      value: l.tyre_condition,
      points: { New: 2, Good: 1, 'Needs Replacement': 0 },
      max: 2,
    },
    {
      value: l.import_specs,
      points: { 'GCC Specs': 2, 'US Specs': 1, Other: 0 },
      max: 2,
    },
  ];
}

export type RatingResult = {
  stars: 1 | 2 | 3;
  answeredCount: number;
  percent: number;
} | null;

// Requires at least 3 fields answered before a badge is shown.
const MIN_FIELDS_ANSWERED = 3;

export function computeRating(l: Listing): RatingResult {
  const fields = buildFields(l);
  const answered = fields.filter((f) => f.value !== null && f.value !== undefined && f.value !== '');

  if (answered.length < MIN_FIELDS_ANSWERED) return null;

  let earned = 0;
  let possible = 0;
  for (const f of answered) {
    const key = String(f.value);
    earned += f.points[key] ?? 0;
    possible += f.max;
  }

  const percent = possible > 0 ? (earned / possible) * 100 : 0;
  const stars: 1 | 2 | 3 = percent >= 80 ? 3 : percent >= 50 ? 2 : 1;

  return { stars, answeredCount: answered.length, percent };
}

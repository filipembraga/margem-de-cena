import { describe, expect, it } from 'vitest';

import { formatLongDate, formatShortDate, toDateTimeAttribute } from './dates';

describe('formatLongDate', () => {
  it('writes the full pt-BR date', () => {
    expect(formatLongDate('2026-11-12')).toBe('12 de novembro de 2026');
  });

  it('keeps the calendar day regardless of time zone', () => {
    expect(formatLongDate('2026-01-01')).toBe('1 de janeiro de 2026');
  });

  it('rejects a malformed date', () => {
    expect(() => formatLongDate('12/11/2026')).toThrow(/YYYY-MM-DD/);
  });
});

describe('formatShortDate', () => {
  it('writes day, abbreviated month without a period, and year', () => {
    expect(formatShortDate('2026-11-12')).toBe('12 nov 2026');
  });

  it('pads single-digit days, as in the card design', () => {
    expect(formatShortDate('2026-11-09')).toBe('09 nov 2026');
  });

  it('can omit the year', () => {
    expect(formatShortDate('2026-11-05', { includeYear: false })).toBe('05 nov');
  });

  it('handles every month without periods', () => {
    const months = Array.from({ length: 12 }, (_, index) =>
      formatShortDate(`2026-${String(index + 1).padStart(2, '0')}-15`, { includeYear: false }),
    );

    expect(months).toEqual([
      '15 jan',
      '15 fev',
      '15 mar',
      '15 abr',
      '15 mai',
      '15 jun',
      '15 jul',
      '15 ago',
      '15 set',
      '15 out',
      '15 nov',
      '15 dez',
    ]);
  });
});

describe('toDateTimeAttribute', () => {
  it('returns the ISO calendar date', () => {
    expect(toDateTimeAttribute('2026-11-12')).toBe('2026-11-12');
  });
});

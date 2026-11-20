import { describe, expect, it } from 'vitest';

import { countWords, estimateReadingTimeInMinutes } from './reading-time';

describe('countWords', () => {
  it('counts words separated by any whitespace', () => {
    expect(countWords('  Há filmes que\nterminam\tquando ')).toBe(5);
  });

  it('returns zero for blank text', () => {
    expect(countWords(' \n ')).toBe(0);
  });
});

describe('estimateReadingTimeInMinutes', () => {
  it('rounds up to the next minute', () => {
    expect(estimateReadingTimeInMinutes(201)).toBe(2);
  });

  it('never returns less than one minute', () => {
    expect(estimateReadingTimeInMinutes(0)).toBe(1);
  });
});

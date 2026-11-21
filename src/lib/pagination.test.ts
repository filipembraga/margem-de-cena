import { describe, expect, it } from 'vitest';

import { countPages, paginate, parsePageNumber } from './pagination';

const LETTERS = ['a', 'b', 'c', 'd', 'e'];

describe('countPages', () => {
  it('rounds up and never returns less than one page', () => {
    expect(countPages(5, 2)).toBe(3);
    expect(countPages(4, 2)).toBe(2);
    expect(countPages(0, 2)).toBe(1);
  });
});

describe('paginate', () => {
  it('returns the items of the page and where they start', () => {
    expect(paginate(LETTERS, 2, 2)).toEqual({
      items: ['c', 'd'],
      pageNumber: 2,
      pageCount: 3,
      firstItemPosition: 3,
    });
  });

  it('returns a shorter last page', () => {
    expect(paginate(LETTERS, 3, 2)?.items).toEqual(['e']);
  });

  it('returns null for pages out of range', () => {
    expect(paginate(LETTERS, 0, 2)).toBeNull();
    expect(paginate(LETTERS, 4, 2)).toBeNull();
    expect(paginate(LETTERS, 1.5, 2)).toBeNull();
  });

  it('returns one empty page for an empty list', () => {
    expect(paginate([], 1, 2)).toEqual({
      items: [],
      pageNumber: 1,
      pageCount: 1,
      firstItemPosition: 1,
    });
  });
});

describe('parsePageNumber', () => {
  it('accepts plain positive integers only', () => {
    expect(parsePageNumber('2')).toBe(2);
    expect(parsePageNumber('12')).toBe(12);
    expect(parsePageNumber('0')).toBeNull();
    expect(parsePageNumber('02')).toBeNull();
    expect(parsePageNumber('1.5')).toBeNull();
    expect(parsePageNumber('dois')).toBeNull();
  });
});

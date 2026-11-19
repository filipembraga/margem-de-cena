import { describe, expect, it } from 'vitest';

import { classNames } from './class-names';

describe('classNames', () => {
  it('joins the given class names with spaces', () => {
    expect(classNames('kicker', 'text-accent')).toBe('kicker text-accent');
  });

  it('skips false, null, undefined and empty values', () => {
    const isFeatured = false;

    expect(classNames('card', isFeatured && 'card-featured', null, undefined, '')).toBe('card');
  });
});

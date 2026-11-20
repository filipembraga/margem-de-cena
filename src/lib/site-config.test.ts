import { describe, expect, it } from 'vitest';

import { primaryNavigation, withoutEmptySections } from './site-config';

describe('withoutEmptySections', () => {
  it('hides sections without content and keeps pages that are always there', () => {
    const visibleItems = withoutEmptySections(primaryNavigation, new Set(['film', 'book']));

    expect(visibleItems.map((item) => item.label)).toEqual(['Filmes', 'Livros', 'Sobre']);
  });

  it('shows Duas Leituras once an entry exists', () => {
    const visibleItems = withoutEmptySections(primaryNavigation, new Set(['two-perspectives']));

    expect(visibleItems.map((item) => item.label)).toEqual(['Duas Leituras', 'Sobre']);
  });
});

import { describe, expect, it } from 'vitest';

import { getFooterContactLine, primaryNavigation, withoutEmptySections } from './site-config';

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

describe('getFooterContactLine', () => {
  it('shows the contact e-mail once it exists', () => {
    expect(getFooterContactLine('contato@exemplo.com', true)).toBe(
      'Publicação cultural independente · contato@exemplo.com',
    );
  });

  it('shows a placeholder outside production and leaves it out of production', () => {
    expect(getFooterContactLine(null, false)).toBe(
      'Publicação cultural independente · [A PREENCHER: e-mail]',
    );
    expect(getFooterContactLine(null, true)).toBe('Publicação cultural independente');
  });
});

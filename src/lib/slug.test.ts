import { describe, expect, it } from 'vitest';

import { getTagPath, slugify } from './slug';

describe('slugify', () => {
  it('removes Portuguese diacritics', () => {
    expect(slugify('Memória')).toBe('memoria');
    expect(slugify('Ação e reação')).toBe('acao-e-reacao');
    expect(slugify('Séries')).toBe('series');
  });

  it('joins words with single hyphens', () => {
    expect(slugify('Alice Hoffman')).toBe('alice-hoffman');
    expect(slugify('  Duas   Leituras!  ')).toBe('duas-leituras');
  });

  it('keeps digits', () => {
    expect(slugify('2001: Uma Odisseia no Espaço')).toBe('2001-uma-odisseia-no-espaco');
  });
});

describe('getTagPath', () => {
  it('builds the tag page path from the tag name', () => {
    expect(getTagPath('Alice Hoffman')).toBe('/tags/alice-hoffman');
  });
});

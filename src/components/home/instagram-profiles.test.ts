import { describe, expect, it } from 'vitest';

import type { Author } from '@/content';

import { chooseInstagramProfiles } from './instagram-profiles';

function author(name: string, instagramHandle: string | null): Author {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return {
    slug,
    name,
    path: `/autores/${slug}`,
    shortBio: '',
    fullBio: '',
    profileImage: null,
    instagramHandle,
  };
}

const AUTHORS = [author('Filipe Braga', 'djfillzouk'), author('Adriana Guimarães', 'drika0')];

describe('chooseInstagramProfiles', () => {
  it("invites readers to the publication's profile once it exists", () => {
    expect(chooseInstagramProfiles('margemdecena', 'Margem de Cena', AUTHORS)).toEqual({
      profiles: [{ handle: 'margemdecena', ownerName: 'Margem de Cena' }],
      isAuthorProfiles: false,
    });
  });

  it("falls back to the authors' profiles until then", () => {
    expect(chooseInstagramProfiles(null, 'Margem de Cena', AUTHORS)).toEqual({
      profiles: [
        { handle: 'djfillzouk', ownerName: 'Filipe Braga' },
        { handle: 'drika0', ownerName: 'Adriana Guimarães' },
      ],
      isAuthorProfiles: true,
    });
  });

  it('leaves out authors without a profile', () => {
    const result = chooseInstagramProfiles(null, 'Margem de Cena', [
      author('Filipe Braga', null),
      author('Adriana Guimarães', 'drika0'),
    ]);
    expect(result.profiles).toEqual([{ handle: 'drika0', ownerName: 'Adriana Guimarães' }]);
  });
});

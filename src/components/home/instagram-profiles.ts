import type { Author } from '@/content';

import type { InstagramProfile } from './InstagramInvite';

export type InstagramInviteProfiles = {
  profiles: InstagramProfile[];
  isAuthorProfiles: boolean;
};

/**
 * Which profiles the home page invites readers to follow: the publication's, once it has one;
 * until then, the authors' own profiles, so the invitation is never empty.
 */
export function chooseInstagramProfiles(
  publicationHandle: string | null,
  publicationName: string,
  authors: Author[],
): InstagramInviteProfiles {
  if (publicationHandle !== null) {
    return {
      profiles: [{ handle: publicationHandle, ownerName: publicationName }],
      isAuthorProfiles: false,
    };
  }

  return {
    profiles: authors.flatMap((author) =>
      author.instagramHandle === null
        ? []
        : [{ handle: author.instagramHandle, ownerName: author.name }],
    ),
    isAuthorProfiles: true,
  };
}

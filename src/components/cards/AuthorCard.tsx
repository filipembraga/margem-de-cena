import Image from 'next/image';
import Link from 'next/link';

import type { Author } from '@/content';
import { getInstagramUrl } from '@/lib/site-config';

type AuthorCardProps = {
  author: Author;
  headingLevel?: 'h2' | 'h3';
};

/** Avatar, name, short bio and Instagram handle, under a hairline. */
export function AuthorCard({ author, headingLevel: Heading = 'h3' }: AuthorCardProps) {
  return (
    <article className="flex flex-col gap-3 border-t border-fg pt-4">
      <AuthorAvatar author={author} />
      <Heading className="font-display text-[1.625rem] leading-tight font-medium">
        <Link href={author.path} className="hover:text-accent">
          {author.name}
        </Link>
      </Heading>
      <p className="font-reading text-[0.9375rem] leading-relaxed text-fg-soft">
        {author.shortBio}
      </p>
      {author.instagramHandle && (
        <p>
          <a
            href={getInstagramUrl(author.instagramHandle)}
            rel="noopener noreferrer"
            target="_blank"
            className="type-meta link-body"
          >
            @{author.instagramHandle}
            <span className="sr-only"> no Instagram (abre em nova aba)</span>
          </a>
        </p>
      )}
    </article>
  );
}

/** A circle with the profile photo, or an empty circle until there is one. */
export function AuthorAvatar({ author, size = 72 }: { author: Author; size?: number }) {
  if (!author.profileImage) {
    return (
      <span
        aria-hidden="true"
        className="block shrink-0 rounded-full bg-line"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Image
      src={author.profileImage.src}
      alt={author.profileImage.alt}
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-line object-cover"
    />
  );
}

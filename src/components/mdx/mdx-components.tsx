import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { ArticleBodyContent } from '@/content';
import { getTagPath } from '@/lib/slug';

import { Figure, type FigureProps } from './Figure';
import { Spoiler } from './Spoiler';

/**
 * How each element of an MDX body is rendered. Markdown elements get the article typography;
 * the custom components are the ones authors may use (see docs/como-publicar.md).
 */

/** An explicit tag mention: links to the tag page and adds the tag to the article. */
function Tag({ name, children }: { name?: string; children: ReactNode }) {
  // The compiler only accepts plain text inside <Tag>, so children is a string here.
  const tagName = name ?? String(children);
  return (
    <Link href={getTagPath(tagName)} className="link-body">
      {children}
    </Link>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <mark>{children}</mark>;
}

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-2 border-l-2 border-accent py-1 pl-7 type-quote text-fg">
      {children}
    </blockquote>
  );
}

/**
 * A numbered note in the right margin on wide screens, and a block right below the sentence on
 * small ones. The compiler numbers the notes (`number`), so reference and note always match.
 * Spans keep the markup valid inside a paragraph.
 */
function MarginNote({ number, children }: { number?: string; children: ReactNode }) {
  return (
    <>
      <sup className="ml-0.5 font-ui text-[0.6875rem] text-accent not-italic">{number}</sup>
      <span
        role="note"
        className="my-4 flex gap-3 type-note text-accent lg:absolute lg:left-[calc(100%+3.5rem)] lg:my-0 lg:w-50"
      >
        <span aria-hidden="true" className="w-px shrink-0 bg-accent" />
        <span>
          <sup className="mr-1 font-ui text-[0.625rem] not-italic">{number}</sup>
          <span className="sr-only">Nota {number}: </span>
          {children}
        </span>
      </span>
    </>
  );
}

function Heading2(props: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className="mt-4 type-section-title" {...props} />;
}

function Heading3(props: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className="mt-2 font-display text-[1.75rem] leading-tight font-medium" {...props} />;
}

/** Internal links stay in the app router; external ones open normally, in the same tab. */
function Anchor({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/')) {
    return <Link href={href} className="link-body" {...props} />;
  }
  return <a href={href} className="link-body" {...props} />;
}

function UnorderedList(props: ComponentPropsWithoutRef<'ul'>) {
  return <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-accent" {...props} />;
}

function OrderedList(props: ComponentPropsWithoutRef<'ol'>) {
  return <ol className="flex list-decimal flex-col gap-2 pl-6 marker:text-accent" {...props} />;
}

/** A Markdown quote (`>`) looks the same as a pull quote. */
function Blockquote({ children }: ComponentPropsWithoutRef<'blockquote'>) {
  return <PullQuote>{children}</PullQuote>;
}

/** A section break, drawn as three spaced dots. */
function ThematicBreak() {
  return (
    <div
      role="separator"
      className="text-center font-display text-[1.375rem] tracking-[0.6em] text-accent"
    >
      <span aria-hidden="true">· · ·</span>
    </div>
  );
}

const markdownAndInlineComponents = {
  Tag,
  Highlight,
  PullQuote,
  MarginNote,
  h2: Heading2,
  h3: Heading3,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  blockquote: Blockquote,
  hr: ThematicBreak,
};

/**
 * The components for one body. `<Figure>` gets the dimensions the content layer measured
 * for that body's images, so images render without layout shift.
 */
export function createMdxComponents(body: Pick<ArticleBodyContent, 'imageSizes'>) {
  function BodyFigure(props: FigureProps) {
    const size = body.imageSizes[props.src];
    if (!size) {
      // The catalog measures every <Figure> image, so this only happens with a broken source.
      throw new Error(`Image "${props.src}" was not measured by the content layer.`);
    }
    return <Figure {...props} size={size} />;
  }

  return { ...markdownAndInlineComponents, Figure: BodyFigure, Spoiler };
}

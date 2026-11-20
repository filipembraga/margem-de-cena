import { run } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';

import type { ArticleBodyContent } from '@/content';
import { classNames } from '@/lib/class-names';

import { mdxComponents } from './mdx-components';

type ArticleBodyProps = {
  body: ArticleBodyContent;
  /** Starts the first paragraph with a drop cap, as in the article design. */
  withDropCap?: boolean;
  className?: string;
};

/**
 * Renders a body compiled by the content layer (docs/adr/0003-mdx-compilation-with-mdx-js.md).
 * The only component that knows the body format: another format would add a branch here.
 */
export async function ArticleBody({ body, withDropCap = false, className }: ArticleBodyProps) {
  const { default: MdxContent } = await run(body.compiledCode, {
    ...jsxRuntime,
    baseUrl: import.meta.url,
  });

  return (
    <div
      className={classNames(
        'relative flex flex-col gap-7 type-body',
        withDropCap && 'drop-cap',
        className,
      )}
    >
      <MdxContent components={mdxComponents} />
    </div>
  );
}

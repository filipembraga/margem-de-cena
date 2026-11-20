import type { StructuredData } from './structured-data';

/**
 * Embeds structured data in the page. `<` is escaped so text from content can never close
 * the script element early.
 */
export function JsonLd({ data }: { data: StructuredData }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

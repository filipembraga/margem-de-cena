import { TagChip } from '@/components/ui/TagChip';
import type { TagReference } from '@/content';

type ArticleEndMatterProps = {
  references: string[];
  tags: TagReference[];
};

/** "Notas e referências" and the tag chips that close an article. */
export function ArticleEndMatter({ references, tags }: ArticleEndMatterProps) {
  if (references.length === 0 && tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {references.length > 0 && (
        <section
          aria-labelledby="notas-e-referencias"
          className="flex flex-col gap-2 border-t border-line pt-4.5 font-ui text-[0.8125rem] leading-relaxed text-muted"
        >
          <h2 id="notas-e-referencias" className="type-kicker text-fg">
            Notas e referências
          </h2>
          <ol className="flex flex-col gap-1">
            {references.map((reference, index) => (
              <li key={reference}>
                <span className="text-accent">{index + 1}.</span> {reference}
              </li>
            ))}
          </ol>
        </section>
      )}
      {tags.length > 0 && (
        <section aria-label="Etiquetas">
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <TagChip name={tag.name} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

import { classNames } from '@/lib/class-names';

/** Marks a single piece of demonstration content (docs/adr/0004-demo-content-isolation.md). */
export function DemoLabel({ className }: { className?: string }) {
  return (
    <p
      className={classNames(
        'inline-block border border-accent px-2 py-1 type-kicker text-accent',
        className,
      )}
    >
      Conteúdo de demonstração
    </p>
  );
}

type ClassNameValue = string | false | null | undefined;

/**
 * Joins class names, skipping empty and conditional values:
 * `classNames('card', isFeatured && 'card-featured')`.
 */
export function classNames(...values: ClassNameValue[]): string {
  return values.filter(Boolean).join(' ');
}

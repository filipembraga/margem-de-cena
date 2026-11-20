import { countWords } from '@/lib/reading-time';

/**
 * A remark plugin that runs once per body while it is compiled (docs/adr/0003). In one walk it:
 *
 * - rejects what authors must not use: `import`/`export`, `{expressions}`, raw HTML and
 *   components outside the allowed list, Markdown images and level-1 headings;
 * - collects `<Tag>` mentions, which populate the article's tags (docs/adr/0007);
 * - numbers `<MarginNote>` elements, so the reference and the note share a number;
 * - counts words for the reading time.
 *
 * Results are written to `file.data[BODY_ANALYSIS_KEY]` instead of thrown, so every problem
 * in every file can be reported together.
 */

export const BODY_ANALYSIS_KEY = 'margemDeCenaBodyAnalysis';

export type BodyIssue = {
  message: string;
  line: number | null;
};

export type BodyAnalysis = {
  tagMentions: string[];
  wordCount: number;
  issues: BodyIssue[];
};

/** Components an author may use, with the attributes each one accepts. */
const ALLOWED_COMPONENTS: Record<string, readonly string[]> = {
  Tag: ['name'],
  Highlight: [],
  PullQuote: [],
  MarginNote: [],
};

export const ALLOWED_COMPONENT_NAMES = Object.keys(ALLOWED_COMPONENTS);

/**
 * The subset of the Markdown/MDX syntax tree this plugin reads. Declared locally because the
 * full `mdast` types are a transitive dependency of `@mdx-js/mdx`.
 */
type SyntaxNode = {
  type: string;
  value?: unknown;
  name?: string | null;
  depth?: number;
  attributes?: JsxAttribute[];
  children?: SyntaxNode[];
  position?: { start: { line: number } };
};

type JsxAttribute = {
  type: string;
  name?: string;
  value?: unknown;
};

type CompiledFile = {
  data: Record<string, unknown>;
};

export function remarkBodyRules() {
  return function analyzeBody(tree: SyntaxNode, file: CompiledFile): void {
    const analysis: BodyAnalysis = { tagMentions: [], wordCount: 0, issues: [] };
    let marginNoteCount = 0;

    function reportIssue(message: string, node: SyntaxNode): void {
      analysis.issues.push({ message, line: node.position?.start.line ?? null });
    }

    function visit(node: SyntaxNode): void {
      switch (node.type) {
        case 'mdxjsEsm':
          reportIssue('"import" e "export" não são permitidos no texto.', node);
          return;
        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          reportIssue('Expressões entre chaves ({...}) não são permitidas no texto.', node);
          return;
        case 'image':
        case 'imageReference':
          reportIssue('Imagens no corpo do texto ainda não são suportadas.', node);
          return;
        case 'heading':
          if (node.depth === 1) {
            reportIssue('Use "##" para intertítulos: o título do texto já é o nível 1.', node);
          }
          break;
        case 'text':
        case 'inlineCode':
          analysis.wordCount += typeof node.value === 'string' ? countWords(node.value) : 0;
          break;
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement':
          if (!checkComponent(node)) {
            return;
          }
          if (node.name === 'Tag') {
            collectTagMention(node);
          }
          if (node.name === 'MarginNote') {
            marginNoteCount += 1;
            numberMarginNote(node, marginNoteCount);
          }
          break;
      }

      node.children?.forEach(visit);
    }

    /** Returns false when the element is not allowed, so its content is not analyzed. */
    function checkComponent(node: SyntaxNode): boolean {
      const componentName = node.name ?? '';
      const allowedAttributes = ALLOWED_COMPONENTS[componentName];

      if (!allowedAttributes) {
        const shownName = componentName === '' ? '<>' : `<${componentName}>`;
        reportIssue(
          `Componente ${shownName} não permitido. Use: ${ALLOWED_COMPONENT_NAMES.join(', ')}.`,
          node,
        );
        return false;
      }

      for (const attribute of node.attributes ?? []) {
        const isTextAttribute =
          attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string';
        const isKnownAttribute = allowedAttributes.includes(attribute.name ?? '');

        if (!isTextAttribute || !isKnownAttribute) {
          reportIssue(
            `Atributo não permitido em <${componentName}>` +
              (allowedAttributes.length > 0
                ? `. Aceita apenas: ${allowedAttributes.map((name) => `${name}="..."`).join(', ')}.`
                : ': este componente não aceita atributos.'),
            node,
          );
        }
      }
      return true;
    }

    function collectTagMention(node: SyntaxNode): void {
      const nameAttribute = node.attributes?.find((attribute) => attribute.name === 'name');
      const children = node.children ?? [];
      const hasOnlyText = children.every((child) => child.type === 'text');

      if (!hasOnlyText) {
        reportIssue('<Tag> aceita apenas texto simples, sem formatação dentro.', node);
        return;
      }

      const visibleText = children.map((child) => String(child.value)).join('');
      const tagName = typeof nameAttribute?.value === 'string' ? nameAttribute.value : visibleText;

      if (tagName.trim() === '') {
        reportIssue('<Tag> vazia: escreva o texto da etiqueta entre as marcações.', node);
        return;
      }
      analysis.tagMentions.push(tagName.trim());
    }

    function numberMarginNote(node: SyntaxNode, number: number): void {
      node.attributes = [
        ...(node.attributes ?? []),
        { type: 'mdxJsxAttribute', name: 'number', value: String(number) },
      ];
    }

    visit(tree);
    file.data[BODY_ANALYSIS_KEY] = analysis;
  };
}

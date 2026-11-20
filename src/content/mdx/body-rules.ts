import { countWords } from '@/lib/reading-time';

import { IMAGE_SOURCE_PATTERN } from '../schemas';

/**
 * A remark plugin that runs once per body while it is compiled (docs/adr/0003). In one walk it:
 *
 * - rejects what authors must not use: `import`/`export`, `{expressions}`, raw HTML and
 *   components outside the allowed list, Markdown images and level-1 headings;
 * - checks each component's attributes and placement (`<Figure>` and `<Spoiler>` stand in
 *   their own paragraph; a spoiler is never nested in another);
 * - collects `<Tag>` mentions, which populate the article's tags (docs/adr/0007);
 * - collects `<Figure>` images, so the catalog can check them and read their dimensions;
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

/** An image placed in the body with `<Figure src="...">`. */
export type BodyImage = {
  src: string;
  line: number | null;
};

export type BodyAnalysis = {
  tagMentions: string[];
  images: BodyImage[];
  wordCount: number;
  issues: BodyIssue[];
};

type ComponentRule = {
  /** Attributes the component accepts, all written as text (`name="..."`). */
  attributes: readonly string[];
  requiredAttributes?: readonly string[];
  /** Must stand in its own paragraph, separated from the text by blank lines. */
  isBlock?: boolean;
  /** Takes no content: written as `<Figure ... />`. */
  isSelfClosing?: boolean;
};

/** Components an author may use (docs/como-publicar.md), with their rules. */
const ALLOWED_COMPONENTS: Record<string, ComponentRule> = {
  Tag: { attributes: ['name'] },
  Highlight: { attributes: [] },
  PullQuote: { attributes: [] },
  MarginNote: { attributes: [] },
  Spoiler: { attributes: ['description'], isBlock: true },
  Figure: {
    attributes: ['src', 'alt', 'caption', 'credit', 'license'],
    requiredAttributes: ['src', 'alt', 'credit', 'license'],
    isBlock: true,
    isSelfClosing: true,
  },
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
    const analysis: BodyAnalysis = { tagMentions: [], images: [], wordCount: 0, issues: [] };
    let marginNoteCount = 0;
    let isInsideSpoiler = false;

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
          reportIssue('Para pôr uma imagem no texto, use <Figure src="..." alt="..." />.', node);
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
          if (node.name === 'Figure') {
            collectImage(node);
          }
          if (node.name === 'MarginNote') {
            marginNoteCount += 1;
            numberMarginNote(node, marginNoteCount);
          }
          if (node.name === 'Spoiler') {
            visitSpoiler(node);
            return;
          }
          break;
      }

      node.children?.forEach(visit);
    }

    function visitSpoiler(node: SyntaxNode): void {
      if (isInsideSpoiler) {
        reportIssue('Um <Spoiler> não pode ficar dentro de outro <Spoiler>.', node);
        return;
      }
      isInsideSpoiler = true;
      node.children?.forEach(visit);
      isInsideSpoiler = false;
    }

    /** Returns false when the element is not allowed, so its content is not analyzed. */
    function checkComponent(node: SyntaxNode): boolean {
      const componentName = node.name ?? '';
      const rule = ALLOWED_COMPONENTS[componentName];

      if (!rule) {
        const shownName = componentName === '' ? '<>' : `<${componentName}>`;
        reportIssue(
          `Componente ${shownName} não permitido. Use: ${ALLOWED_COMPONENT_NAMES.join(', ')}.`,
          node,
        );
        return false;
      }

      checkAttributes(node, componentName, rule);

      if (rule.isBlock && node.type !== 'mdxJsxFlowElement') {
        reportIssue(
          `<${componentName}> deve ficar em um parágrafo próprio, separado do texto por linhas em branco.`,
          node,
        );
      }
      if (rule.isSelfClosing && (node.children ?? []).length > 0) {
        reportIssue(
          `<${componentName}> não tem conteúdo entre as marcações: escreva <${componentName} ... />.`,
          node,
        );
      }
      return true;
    }

    function checkAttributes(node: SyntaxNode, componentName: string, rule: ComponentRule): void {
      const attributeNames = new Set<string>();

      for (const attribute of node.attributes ?? []) {
        const isTextAttribute =
          attribute.type === 'mdxJsxAttribute' && typeof attribute.value === 'string';
        const isKnownAttribute = rule.attributes.includes(attribute.name ?? '');

        if (!isTextAttribute || !isKnownAttribute) {
          reportIssue(
            `Atributo não permitido em <${componentName}>` +
              (rule.attributes.length > 0
                ? `. Aceita apenas: ${rule.attributes.map((name) => `${name}="..."`).join(', ')}.`
                : ': este componente não aceita atributos.'),
            node,
          );
          continue;
        }
        if (String(attribute.value).trim() !== '') {
          attributeNames.add(attribute.name ?? '');
        }
      }

      for (const requiredName of rule.requiredAttributes ?? []) {
        if (!attributeNames.has(requiredName)) {
          reportIssue(`<${componentName}> precisa do atributo ${requiredName}="...".`, node);
        }
      }
    }

    function collectTagMention(node: SyntaxNode): void {
      const tagNameAttribute = readTextAttribute(node, 'name');
      const children = node.children ?? [];
      const hasOnlyText = children.every((child) => child.type === 'text');

      if (!hasOnlyText) {
        reportIssue('<Tag> aceita apenas texto simples, sem formatação dentro.', node);
        return;
      }

      const visibleText = children.map((child) => String(child.value)).join('');
      const tagName = tagNameAttribute ?? visibleText;

      if (tagName.trim() === '') {
        reportIssue('<Tag> vazia: escreva o texto da etiqueta entre as marcações.', node);
        return;
      }
      analysis.tagMentions.push(tagName.trim());
    }

    function collectImage(node: SyntaxNode): void {
      const source = readTextAttribute(node, 'src');
      if (source === null) {
        // The missing attribute was already reported by checkAttributes.
        return;
      }
      if (!IMAGE_SOURCE_PATTERN.test(source)) {
        reportIssue(
          'O caminho da imagem deve começar com "/images/" (arquivo dentro de public/images).',
          node,
        );
        return;
      }
      analysis.images.push({ src: source, line: node.position?.start.line ?? null });
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

function readTextAttribute(node: SyntaxNode, name: string): string | null {
  const attribute = node.attributes?.find((candidate) => candidate.name === name);
  return typeof attribute?.value === 'string' ? attribute.value : null;
}

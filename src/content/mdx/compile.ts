import { compile, type CompileOptions } from '@mdx-js/mdx';

import {
  BODY_ANALYSIS_KEY,
  remarkBodyRules,
  type BodyAnalysis,
  type BodyImage,
  type BodyIssue,
} from './body-rules';

export type CompiledBody = {
  compiledCode: string;
  tagMentions: string[];
  /** Images placed with `<Figure>`, checked and measured by the catalog. */
  images: BodyImage[];
  wordCount: number;
};

export type CompileBodyResult =
  { success: true; body: CompiledBody } | { success: false; issues: BodyIssue[] };

const COMPILE_OPTIONS: CompileOptions = {
  outputFormat: 'function-body',
  development: false,
  remarkPlugins: [remarkBodyRules] as CompileOptions['remarkPlugins'],
};

/**
 * Compiles an MDX body once, when the catalog loads, and returns what the content layer
 * derives from it. Syntax errors and rule violations come back as issues, never as throws.
 */
export async function compileBody(source: string, origin: string): Promise<CompileBodyResult> {
  try {
    const file = await compile({ value: source, path: origin }, COMPILE_OPTIONS);
    const analysis = file.data[BODY_ANALYSIS_KEY] as BodyAnalysis;

    if (analysis.issues.length > 0) {
      return { success: false, issues: analysis.issues };
    }

    return {
      success: true,
      body: {
        compiledCode: String(file),
        tagMentions: analysis.tagMentions,
        images: analysis.images,
        wordCount: analysis.wordCount,
      },
    };
  } catch (error) {
    return { success: false, issues: [describeCompileError(error)] };
  }
}

/** The MDX compiler throws messages that carry a line number and an English reason. */
function describeCompileError(error: unknown): BodyIssue {
  const line = readNumberProperty(error, 'line');
  const reason = error instanceof Error ? error.message : String(error);

  return { message: `Erro de sintaxe MDX: ${reason}`, line };
}

function readNumberProperty(value: unknown, key: string): number | null {
  if (typeof value === 'object' && value !== null && key in value) {
    const property: unknown = (value as Record<string, unknown>)[key];
    return typeof property === 'number' ? property : null;
  }
  return null;
}

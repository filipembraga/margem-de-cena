import { z } from 'zod';

import { CATEGORIES } from '@/lib/categories';

/**
 * Zod schemas for the raw content files (frontmatter and YAML data).
 *
 * Keys are English, values pt-BR. Messages are pt-BR because the authors read them in the
 * build output. Derived fields (slug, reading time, tags mentioned in the body) are never
 * part of these schemas. See docs/adr/0002-file-based-content-layer.md.
 */

const REQUIRED = 'Campo obrigatório.';

const requiredText = z.string({ error: REQUIRED }).trim().min(1, REQUIRED);

const slugReference = z
  .string({ error: REQUIRED })
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Use só letras minúsculas sem acento, números e hífens (ex.: "a-casa-das-mares").',
  );

const plainDate = z.iso.date({ error: 'Data inválida. Use o formato AAAA-MM-DD.' });

export const articleStatusSchema = z.enum(['draft', 'published', 'demo'], {
  error: 'Status inválido. Use "draft", "published" ou "demo".',
});

export const categorySchema = z.enum(CATEGORIES, {
  error: 'Categoria inválida. Use "film", "book", "series" ou "essay".',
});

export const imageSchema = z.strictObject({
  src: z
    .string({ error: REQUIRED })
    .regex(
      /^\/images\/[\w./-]+$/,
      'O caminho da imagem deve começar com "/images/" (arquivo dentro de public/images).',
    ),
  alt: requiredText,
  credit: requiredText,
  license: requiredText,
});

export const articleFrontmatterSchema = z.strictObject({
  title: requiredText,
  subtitle: requiredText.optional(),
  excerpt: requiredText.max(280, 'O resumo deve ter no máximo 280 caracteres.'),
  category: categorySchema,
  authors: z
    .array(slugReference)
    .min(1, 'Informe ao menos um autor.')
    .max(2, 'Um texto tem no máximo dois autores.'),
  status: articleStatusSchema,
  publishedAt: plainDate.optional(),
  updatedAt: plainDate.optional(),
  work: slugReference.optional(),
  tags: z.array(requiredText).default([]),
  featured: z.boolean().default(false),
  spoilerWarning: z.boolean().default(false),
  cover: imageSchema.optional(),
  references: z.array(requiredText).default([]),
});

export const authorSchema = z.strictObject({
  name: requiredText,
  shortBio: requiredText,
  fullBio: requiredText,
  profileImage: imageSchema.optional(),
  instagram: z
    .string()
    .regex(/^[\w.]+$/, 'Informe o perfil do Instagram sem "@" (ex.: "margemdecena").')
    .optional(),
});

const workBaseShape = {
  title: requiredText,
  originalTitle: requiredText.optional(),
  year: z.int('O ano deve ser um número inteiro.').min(1800).max(2100).optional(),
  genre: requiredText.optional(),
  cover: imageSchema.optional(),
};

export const workSchema = z.discriminatedUnion(
  'category',
  [
    z.strictObject({
      ...workBaseShape,
      category: z.literal('film'),
      directors: z.array(requiredText).default([]),
      runtimeInMinutes: z.int().positive().optional(),
    }),
    z.strictObject({
      ...workBaseShape,
      category: z.literal('book'),
      originalAuthors: z.array(requiredText).default([]),
      publisher: requiredText.optional(),
      translator: requiredText.optional(),
      edition: requiredText.optional(),
    }),
    z.strictObject({
      ...workBaseShape,
      category: z.literal('series'),
      creators: z.array(requiredText).default([]),
      platform: requiredText.optional(),
      seasons: z.int().positive().optional(),
    }),
  ],
  { error: 'Categoria da obra inválida. Use "film", "book" ou "series".' },
);

export const twoPerspectivesSchema = z.strictObject({
  work: slugReference,
  introduction: requiredText,
  /** Order defines Leitura I and Leitura II. */
  articles: z
    .array(slugReference)
    .length(2, 'Uma entrada de Duas Leituras tem exatamente dois textos.'),
});

export const pageFrontmatterSchema = z.strictObject({
  title: requiredText,
  description: requiredText,
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
export type AuthorData = z.infer<typeof authorSchema>;
export type WorkData = z.infer<typeof workSchema>;
export type TwoPerspectivesData = z.infer<typeof twoPerspectivesSchema>;
export type PageFrontmatter = z.infer<typeof pageFrontmatterSchema>;
export type ImageData = z.infer<typeof imageSchema>;

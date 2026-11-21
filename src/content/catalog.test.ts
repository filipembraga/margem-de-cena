import { describe, expect, it } from 'vitest';

import { buildCatalog } from './catalog';
import { ContentValidationError, type ContentIssue } from './issues';
import { articleInput, contentWith } from './testing/fixtures';
import { createInMemorySource, type InMemoryContent } from './testing/in-memory-source';

async function collectIssues(
  content: InMemoryContent,
  options = { includeDemo: true },
): Promise<ContentIssue[]> {
  try {
    await buildCatalog(createInMemorySource(content), options);
    return [];
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return error.issues;
    }
    throw error;
  }
}

function messagesOf(issues: ContentIssue[]): string {
  return issues.map((issue) => issue.message).join('\n');
}

describe('buildCatalog', () => {
  it('returns visible articles with derived path, reading time and authors', async () => {
    const source = createInMemorySource(
      contentWith({ articles: [articleInput('a-mare', { work: 'a-casa' })] }),
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    const [article] = catalog.articles;
    expect(article?.path).toBe('/filmes/a-mare');
    expect(article?.readingTimeInMinutes).toBe(1);
    expect(article?.authors).toEqual([
      { slug: 'filipe-braga', name: 'Filipe Braga', path: '/autores/filipe-braga' },
    ]);
    expect(article?.work?.title).toBe('A casa');
  });

  it('leaves drafts out of the catalog', async () => {
    const source = createInMemorySource(
      contentWith({
        articles: [articleInput('rascunho', { status: 'draft', publishedAt: undefined })],
      }),
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    expect(catalog.articles).toEqual([]);
  });

  it('hides demo articles unless demo content is requested', async () => {
    const content = contentWith({ articles: [articleInput('demo', { status: 'demo' })] });

    const withoutDemo = await buildCatalog(createInMemorySource(content), { includeDemo: false });
    const withDemo = await buildCatalog(createInMemorySource(content), { includeDemo: true });

    expect(withoutDemo.articles).toHaveLength(0);
    expect(withDemo.articles.map((article) => article.isDemo)).toEqual([true]);
  });

  it('reports every problem at once, in Portuguese, with the file of each one', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          articleInput('sem-titulo', { title: '' }),
          articleInput('autor-desconhecido', { authors: ['ninguem'] }),
        ],
      }),
    );

    expect(issues).toEqual([
      expect.objectContaining({
        origin: 'content/articles/sem-titulo',
        message: 'title: Campo obrigatório.',
      }),
      expect.objectContaining({
        origin: 'content/articles/autor-desconhecido',
        message: 'authors: autor "ninguem" não existe em content/authors/.',
      }),
    ]);
  });

  it('accepts demo status only inside content/demo', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          { ...articleInput('fora-do-lugar', { status: 'demo' }), isDemo: false },
          { ...articleInput('publicado-no-demo'), isDemo: true },
        ],
      }),
    );

    expect(messagesOf(issues)).toContain('"status: demo" só é permitido em content/demo/.');
    expect(messagesOf(issues)).toContain('Textos em content/demo/ devem ter "status: demo".');
  });

  it('requires the article category to match its work', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('livro', { category: 'book', work: 'a-casa' })] }),
    );

    expect(messagesOf(issues)).toContain('é da categoria "film", mas o texto é "book"');
  });

  it('rejects article slugs reserved for the archive URLs', async () => {
    const issues = await collectIssues(contentWith({ articles: [articleInput('pagina')] }));

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain('"pagina" é reservado');
  });

  it('allows a single featured published article', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          articleInput('primeiro', { featured: true }),
          articleInput('segundo', { featured: true }),
        ],
      }),
    );

    expect(issues).toHaveLength(1);
    expect(issues[0]?.origin).toBe('content/articles/segundo');
  });
});

describe('article bodies', () => {
  it('builds tags from <Tag> marks first, then frontmatter tags not mentioned in the body', async () => {
    const body = 'Sobre <Tag>memória</Tag> e <Tag name="luto">lutos</Tag>.';
    const source = createInMemorySource(
      contentWith({ articles: [articleInput('a-mare', { tags: ['luto', 'casa'] }, body)] }),
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    expect(catalog.articles[0]?.tags).toEqual([
      { name: 'memória', slug: 'memoria', path: '/tags/memoria' },
      { name: 'luto', slug: 'luto', path: '/tags/luto' },
      { name: 'casa', slug: 'casa', path: '/tags/casa' },
    ]);
  });

  it('rejects two spellings of the same tag across articles', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          articleInput('primeiro', {}, '<Tag>Memória</Tag>'),
          articleInput('segundo', {}, '<Tag>memória</Tag>'),
        ],
      }),
    );

    expect(messagesOf(issues)).toContain('Etiqueta "memória" tem outra grafia');
  });

  it('rejects imports, expressions and components outside the allowed list', async () => {
    const body = ['import X from "x"', '', 'Texto {1 + 1}', '', '<Video src="a.mp4" />'].join('\n');

    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', {}, body)] }),
    );

    expect(issues.map((issue) => [issue.line, issue.message])).toEqual([
      [1, '"import" e "export" não são permitidos no texto.'],
      [3, 'Expressões entre chaves ({...}) não são permitidas no texto.'],
      [5, 'Componente <Video> não permitido. Use: Tag, Highlight, PullQuote, MarginNote, Spoiler, Figure.'],
    ]);
  });

  it('reports MDX syntax errors with their line instead of throwing', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', {}, 'Linha um.\n\n<Highlight>sem fechar')] }),
    );

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toMatch(/^Erro de sintaxe MDX/);
    expect(issues[0]?.line).toBe(3);
  });

  it('numbers margin notes in reading order', async () => {
    const body = 'Um.<MarginNote>Primeira.</MarginNote> Dois.<MarginNote>Segunda.</MarginNote>';
    const source = createInMemorySource(
      contentWith({ articles: [articleInput('a-mare', {}, body)] }),
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    const compiledCode = catalog.articles[0]?.body.compiledCode ?? '';
    expect(compiledCode).toContain('number: "1"');
    expect(compiledCode).toContain('number: "2"');
  });
});

describe('Duas Leituras', () => {
  const secondFilmArticle = articleInput('o-que-fica', {
    work: 'a-casa',
    authors: ['adriana-guimaraes'],
    publishedAt: '2026-11-14',
  });

  it('links an entry to its work and two perspectives, in the declared order', async () => {
    const source = createInMemorySource(
      contentWith({
        articles: [articleInput('a-mare', { work: 'a-casa' }), secondFilmArticle],
        twoPerspectives: [
          {
            slug: 'a-casa',
            data: {
              work: 'a-casa',
              introduction: 'Introdução.',
              articles: ['a-mare', 'o-que-fica'],
            },
          },
        ],
      }),
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    const [entry] = catalog.twoPerspectives;
    expect(entry?.perspectives.map(({ position, article }) => [position, article.slug])).toEqual([
      [1, 'a-mare'],
      [2, 'o-que-fica'],
    ]);
    expect(entry?.publishedAt).toBe('2026-11-14');
    expect(catalog.articles.map((article) => article.twoPerspectivesSlug)).toEqual([
      'a-casa',
      'a-casa',
    ]);
  });

  it('requires two different authors, both texts about the work and both published', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          articleInput('a-mare', { work: 'a-casa' }),
          articleInput('outro', { status: 'draft', publishedAt: undefined }),
        ],
        twoPerspectives: [
          {
            slug: 'a-casa',
            data: { work: 'a-casa', introduction: 'Introdução.', articles: ['a-mare', 'outro'] },
          },
        ],
      }),
    );

    expect(messagesOf(issues)).toContain('o texto "outro" não se refere à obra "a-casa"');
    expect(messagesOf(issues)).toContain('o texto "outro" deve ter "status: published"');
    expect(messagesOf(issues)).toContain('as duas leituras devem ser de autores diferentes');
  });

  it('rejects an entry with only one perspective', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [articleInput('a-mare', { work: 'a-casa' })],
        twoPerspectives: [
          {
            slug: 'a-casa',
            data: { work: 'a-casa', introduction: 'Introdução.', articles: ['a-mare'] },
          },
        ],
      }),
    );

    expect(messagesOf(issues)).toContain(
      'Uma entrada de Duas Leituras tem exatamente dois textos.',
    );
  });
});

describe('images', () => {
  const cover = { src: '/images/a-mare.jpg', alt: 'Uma casa.', credit: 'Foto.', license: 'CC BY' };
  const knownImages = { '/images/a-mare.jpg': { width: 1600, height: 900 } };

  it('requires referenced images to exist', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', { cover })] }),
    );

    expect(messagesOf(issues)).toBe('Imagem não encontrada ou ilegível: public/images/a-mare.jpg.');
  });

  it('requires alt text, credit and licence', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', { cover: { src: cover.src } })] }),
    );

    expect(issues.map((issue) => issue.message)).toEqual([
      expect.stringMatching(/^cover\.alt:/),
      expect.stringMatching(/^cover\.credit:/),
      expect.stringMatching(/^cover\.license:/),
    ]);
  });

  it('adds the intrinsic dimensions to covers', async () => {
    const source = createInMemorySource(
      contentWith({ articles: [articleInput('a-mare', { cover })] }),
      knownImages,
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    expect(catalog.articles[0]?.cover).toEqual({ ...cover, width: 1600, height: 900 });
  });
});

describe('figures in the body', () => {
  const figure =
    '<Figure src="/images/a-mare.jpg" alt="Uma casa." credit="Foto." license="CC BY" />';
  const knownImages = { '/images/a-mare.jpg': { width: 1200, height: 1800 } };

  it('keeps the dimensions of the images the body places', async () => {
    const source = createInMemorySource(
      contentWith({ articles: [articleInput('a-mare', {}, `Antes.\n\n${figure}\n\nDepois.`)] }),
      knownImages,
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    expect(catalog.articles[0]?.body.imageSizes).toEqual({
      '/images/a-mare.jpg': { width: 1200, height: 1800 },
    });
  });

  it('reports a missing image with its line', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', {}, `Antes.\n\n${figure}`)] }),
    );

    expect(issues).toEqual([
      expect.objectContaining({
        message: 'Imagem não encontrada ou ilegível: public/images/a-mare.jpg.',
        line: 3,
      }),
    ]);
  });

  it('requires alt text, credit and licence', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [articleInput('a-mare', {}, '<Figure src="/images/a-mare.jpg" alt="" />')],
      }),
      { includeDemo: false },
    );

    expect(issues.map((issue) => issue.message)).toEqual([
      '<Figure> precisa do atributo alt="...".',
      '<Figure> precisa do atributo credit="...".',
      '<Figure> precisa do atributo license="...".',
    ]);
  });

  it('must stand in its own paragraph, without content', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          articleInput(
            'a-mare',
            {},
            'Texto <Figure src="/images/a-mare.jpg" alt="A." credit="B." license="C." /> no meio.\n\n' +
              '<Figure src="/images/a-mare.jpg" alt="A." credit="B." license="C.">Legenda</Figure>',
          ),
        ],
      }),
    );

    expect(messagesOf(issues)).toContain('<Figure> deve ficar em um parágrafo próprio');
    expect(messagesOf(issues)).toContain('<Figure> não tem conteúdo entre as marcações');
  });

  it('suggests <Figure> for Markdown images', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', {}, '![Uma casa](/images/a-mare.jpg)')] }),
    );

    expect(messagesOf(issues)).toContain('use <Figure src="..." alt="..." />');
  });
});

describe('spoilers in the body', () => {
  it('accepts a spoiler in its own paragraph and counts its words', async () => {
    const source = createInMemorySource(
      contentWith({
        articles: [
          articleInput(
            'a-mare',
            {},
            '<Spoiler description="O final.">\n\nA mesa está posta para uma pessoa.\n\n</Spoiler>',
          ),
        ],
      }),
    );

    const catalog = await buildCatalog(source, { includeDemo: false });

    expect(catalog.articles).toHaveLength(1);
  });

  it('rejects a spoiler inside another spoiler', async () => {
    const issues = await collectIssues(
      contentWith({
        articles: [
          articleInput(
            'a-mare',
            {},
            '<Spoiler>\n\n<Spoiler>\n\nTexto.\n\n</Spoiler>\n\n</Spoiler>',
          ),
        ],
      }),
    );

    expect(messagesOf(issues)).toBe('Um <Spoiler> não pode ficar dentro de outro <Spoiler>.');
  });

  it('rejects a spoiler in the middle of a sentence', async () => {
    const issues = await collectIssues(
      contentWith({ articles: [articleInput('a-mare', {}, 'Texto <Spoiler>final</Spoiler>.')] }),
    );

    expect(messagesOf(issues)).toContain('<Spoiler> deve ficar em um parágrafo próprio');
  });
});

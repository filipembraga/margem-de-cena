# Como publicar na Margem de Cena

Guia para quem escreve. Explica onde cada texto fica, quais campos preencher e como usar os
recursos do texto (etiquetas, notas de margem, destaques). Não é preciso saber programar: os
textos são arquivos de texto simples, e o site avisa quando algo está faltando.

## Onde fica cada coisa

Todo o conteúdo mora na pasta `content/`:

| Pasta | O que guarda | Formato |
| --- | --- | --- |
| `content/articles/` | os textos (críticas, leituras, ensaios) | `.mdx` |
| `content/works/` | as obras: filmes, livros e séries | `.yaml` |
| `content/two-perspectives/` | as entradas de Duas Leituras | `.yaml` |
| `content/authors/` | os autores | `.yaml` |
| `content/pages/` | Sobre, Contato, Privacidade e Créditos | `.mdx` |
| `public/images/` | as imagens (com crédito e licença) | `.jpg`, `.png`, `.webp` |
| `content/demo/` | conteúdo de demonstração, que **nunca** aparece no site publicado | |

**O nome do arquivo é o endereço do texto.** O arquivo `content/articles/a-mare-que-nao-volta.mdx`,
de um filme, vira `margemdecena…/filmes/a-mare-que-nao-volta`. Use só letras minúsculas sem
acento, números e hífens.

> **O endereço é permanente.** Depois que um texto é publicado, não renomeie o arquivo: links
> compartilhados, buscadores e, no futuro, curtidas e comentários dependem dele. Se for mesmo
> preciso mudar, fale com o Filipe para criar o redirecionamento do endereço antigo.

## Um texto novo

Crie um arquivo em `content/articles/`, com um bloco de informações entre linhas `---` no
topo (o *frontmatter*) e o texto logo abaixo:

```mdx
---
title: A maré que não volta
subtitle: Sobre casas que guardam ausências e o tempo que uma imagem leva para virar memória.
excerpt: Como os enquadramentos fixos fazem da casa uma memória.
category: film
work: a-casa-das-mares
authors:
  - filipe-braga
status: published
publishedAt: 2026-11-12
---

Há filmes que terminam quando a tela escurece, e há outros que apenas mudam de lugar.

## A casa como personagem

A escolha de <Tag>enquadramento</Tag> fixo transforma o espaço em <Tag>memória</Tag>.
```

### Campos do texto

| Campo | Obrigatório | O que é |
| --- | --- | --- |
| `title` | sim | título |
| `subtitle` | não | linha fina, em itálico abaixo do título |
| `excerpt` | sim | resumo dos cards e dos buscadores, até 280 caracteres |
| `category` | sim | `film` (Filmes), `book` (Livros), `series` (Séries) ou `essay` (Ensaios) |
| `work` | não | nome do arquivo da obra em `content/works/`, sem `.yaml`. Ensaios não têm obra |
| `authors` | sim | um ou dois autores: `filipe-braga`, `adriana-guimaraes` |
| `status` | sim | `published` para publicar. Veja [Rascunhos](#rascunhos) |
| `publishedAt` | sim | data de publicação, no formato `AAAA-MM-DD` |
| `updatedAt` | não | data da última revisão relevante |
| `tags` | não | etiquetas extras, que não aparecem marcadas no texto (veja [Etiquetas](#etiquetas)) |
| `featured` | não | `true` para ser o destaque da página inicial. Só um texto por vez |
| `spoilerWarning` | não | `true` mostra um aviso de spoiler abaixo do nome do autor |
| `cover` | não | imagem de capa (veja [Imagens](#imagens)). Sem capa, o site usa uma capa tipográfica com o nome da obra |
| `references` | não | lista de "Notas e referências" do fim do texto |

O tempo de leitura e a lista de etiquetas são calculados pelo site; não escreva esses campos.

### Formatação do texto

O texto usa Markdown:

| Para ter | Escreva |
| --- | --- |
| intertítulo | `## A casa como personagem` (use `###` para um nível abaixo) |
| itálico | `*A casa das marés*` |
| negrito | `**palavra**` |
| link | `[texto do link](https://endereco.com)` |
| citação | uma linha começando com `>` |
| lista | linhas começando com `-` (ou `1.` para lista numerada) |
| pausa entre partes | uma linha só com `---` (vira `· · ·`) |

Não use `#` sozinho: o título do texto já ocupa esse nível.

## Recursos do texto

Além do Markdown, há quatro marcações. Elas se escrevem como etiquetas, com abertura e
fechamento.

### Etiquetas: `<Tag>`

Marque as palavras que devem virar etiqueta. A palavra marcada vira um link para a página da
etiqueta (por exemplo, `/tags/memoria`), que reúne todos os textos com ela, e entra na lista de
etiquetas no fim do texto.

```mdx
Um filme sobre <Tag>memória</Tag> e <Tag>luto</Tag>.
```

Quando a palavra no texto for diferente da etiqueta (plural, outra flexão), indique a etiqueta
em `name`:

```mdx
As <Tag name="memória">memórias</Tag> da casa.
```

- Só as palavras que você marca viram link. O site nunca transforma palavras em link sozinho.
- O campo `tags` do frontmatter serve para etiquetas que **não** aparecem no texto. Elas
  entram na lista do fim, mas não criam links.
- Escreva cada etiqueta sempre do mesmo jeito em todos os textos ("memória", não "Memória" num
  texto e "memória" em outro). O site recusa grafias diferentes da mesma etiqueta.
- No máximo 12 etiquetas por texto.

### Destaque: `<Highlight>`

Marca um trecho com o efeito de marca-texto.

```mdx
Como se a câmera fosse <Highlight>alguém que já sabe onde a luz bate</Highlight>.
```

### Citação em destaque: `<PullQuote>`

Uma frase grande, em itálico, com fio na margem. Use em parágrafo próprio.

```mdx
<PullQuote>Uma casa vazia filmada com paciência é uma frase que se recusa a terminar.</PullQuote>
```

### Nota de margem: `<MarginNote>`

Um comentário curto que aparece na margem direita (no celular, logo abaixo da frase). Escreva
a nota colada ao ponto do texto a que ela se refere. A numeração é automática.

```mdx
A moldura continua lá, esperando.<MarginNote>Repare na porta entreaberta.</MarginNote>
```

Outras marcações, código entre chaves `{...}` e imagens no meio do texto não são aceitos por
enquanto. O site avisa se encontrar algum.

## Obras

Cada filme, livro ou série tem um arquivo em `content/works/`. Vários textos podem se referir
à mesma obra.

```yaml
# content/works/a-casa-das-mares.yaml
category: film
title: A casa das marés
year: 2025
genre: drama
directors:
  - Nome da Diretora
runtimeInMinutes: 112
```

| Campo | Para | O que é |
| --- | --- | --- |
| `category` | todas | `film`, `book` ou `series` (a mesma categoria dos textos sobre ela) |
| `title` | todas | título no Brasil |
| `originalTitle` | todas | título original, se for diferente |
| `year` | todas | ano de lançamento ou de publicação original |
| `genre` | todas | gênero, em minúsculas ("romance", "drama") |
| `cover` | todas | capa da obra (veja [Imagens](#imagens)) |
| `directors` | filmes | direção (lista) |
| `runtimeInMinutes` | filmes | duração em minutos |
| `originalAuthors` | livros | autoria do livro (lista) |
| `publisher` | livros | editora |
| `translator` | livros | tradução |
| `edition` | livros | edição |
| `creators` | séries | criação (lista) |
| `platform` | séries | plataforma ou emissora |
| `seasons` | séries | número de temporadas |

Só o título e a categoria são obrigatórios. A ficha da obra, ao lado do texto, mostra apenas o
que estiver preenchido.

## Duas Leituras

Uma entrada de Duas Leituras junta **dois textos independentes sobre a mesma obra**, um de cada
autor. Ela só existe quando os dois textos estão prontos: até lá, o primeiro texto é publicado
como um texto comum, e a entrada é criada junto com o segundo.

```yaml
# content/two-perspectives/a-casa-das-mares.yaml
work: a-casa-das-mares
introduction: >-
  Escrevemos sobre esta obra sem ler o texto um do outro antes da publicação.
articles:
  - a-mare-que-nao-volta
  - o-que-a-gente-deixa-nos-comodos
```

- `articles`: exatamente dois textos. O primeiro é a Leitura I, o segundo a Leitura II.
- Os dois textos precisam apontar para a mesma obra (`work`), ter um único autor cada, de
  autores diferentes, e estar publicados.
- Cada texto participa de no máximo uma entrada.

Os dois textos continuam aparecendo também na seção da categoria deles (Filmes, Livros ou
Séries), e cada um ganha um link para a outra leitura.

## Imagens

Coloque o arquivo em `public/images/` (por exemplo, `public/images/obras/a-casa-das-mares.jpg`)
e descreva-o no campo `cover` do texto ou da obra:

```yaml
cover:
  src: /images/obras/a-casa-das-mares.jpg
  alt: Uma casa de madeira na beira do mar, ao entardecer.
  credit: Foto de Fulana de Tal
  license: CC BY 4.0
```

Os quatro campos são obrigatórios:

- **`alt`** descreve a imagem para quem não pode vê-la. Diga o que ela mostra, não repita o
  título.
- **`credit`** e **`license`** dizem de onde a imagem veio e com que permissão é usada. Use só
  imagens com licença clara (fotos próprias, Creative Commons, material de imprensa com
  autorização). Nada copiado de sites de streaming ou de lojas.

## Rascunhos

O repositório pode ser público, então **rascunhos nunca entram no Git**. Escreva o rascunho
onde preferir e coloque o arquivo em `content/articles/` só quando ele estiver pronto para
publicar, com `status: published`.

Se quiser ver o rascunho no site enquanto escreve, use `status: draft` no seu computador: o
texto não aparece em nenhuma página. Um rascunho nunca chega ao site publicado: tanto o commit
quanto a verificação automática do GitHub recusam qualquer arquivo com `status: draft`.

## Ver o texto antes de publicar

No computador, com o projeto instalado (veja o README):

```sh
pnpm dev
```

Abra http://localhost:3000 e navegue até o texto. Se algo estiver errado no arquivo, o site
mostra a lista de problemas, com o nome do arquivo e, quando possível, a linha. Por exemplo:

```
O conteúdo tem 2 problemas:
  - content/articles/a-mare-que-nao-volta.mdx: excerpt: O resumo deve ter no máximo 280 caracteres.
  - content/articles/a-mare-que-nao-volta.mdx (linha 14): Componente <Video> não permitido.
```

Para ver também o conteúdo de demonstração, rode `SHOW_DEMO_CONTENT=true pnpm dev`.

## Publicar

1. Crie uma branch para o texto, por exemplo `content/a-mare-que-nao-volta`.
2. Adicione o texto (e a obra e as imagens, se forem novas) e faça o commit com uma mensagem
   como `content: publish "A maré que não volta"`.
3. Abra um pull request. As verificações automáticas conferem o conteúdo; quando passarem e o
   pull request for aceito, o texto vai para o ar.

Na dúvida em qualquer passo, fale com o Filipe.

## Seções vazias

Uma seção sem textos publicados fica fora do menu e da página inicial, e reaparece sozinha
com o primeiro texto. Isso vale para Filmes, Livros, Séries, Ensaios e Duas Leituras.

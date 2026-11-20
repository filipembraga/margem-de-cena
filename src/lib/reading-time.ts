/**
 * Reading time for the article meta ("11 min de leitura").
 *
 * 200 words per minute is a conservative pace for attentive reading of essayistic prose in
 * Portuguese; the result is rounded up so a short text never shows "0 min".
 */

const WORDS_PER_MINUTE = 200;

/** Counts the words in a piece of plain text. */
export function countWords(text: string): number {
  const words = text.trim().split(/\s+/u);
  return words[0] === '' ? 0 : words.length;
}

/** Minutes needed to read a text of the given length, at least 1. */
export function estimateReadingTimeInMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

import { describe, expect, it } from 'vitest';

import { findAiAttribution } from './no-ai-attribution.mjs';

describe('findAiAttribution', () => {
  it('accepts an ordinary message, including human co-authors', () => {
    expect(findAiAttribution('feat(article): add spoiler reveal component')).toBeNull();
    expect(
      findAiAttribution('content: publish a text\n\nCo-Authored-By: Adriana <adriana@example.com>'),
    ).toBeNull();
  });

  it('rejects a Co-Authored-By trailer naming Claude or Anthropic', () => {
    expect(
      findAiAttribution('fix: something\n\nCo-Authored-By: Claude <noreply@anthropic.com>'),
    ).not.toBeNull();
    expect(findAiAttribution('fix: something\n\nco-authored-by: Anthropic bot')).not.toBeNull();
  });

  it('rejects a "Generated with" line', () => {
    expect(findAiAttribution('fix: something\n\nGenerated with some tool')).not.toBeNull();
  });
});

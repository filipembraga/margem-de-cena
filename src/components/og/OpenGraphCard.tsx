import { DISPLAY_FONT_FAMILY, INTERFACE_FONT_FAMILY } from './open-graph-fonts';

/**
 * The share card, rendered by `next/og` at build time in three formats:
 * - `link-preview` (1200 × 630): the image shown when a link is shared;
 * - `instagram-post` (1080 × 1350, 4:5): the same card for the authors to post on Instagram;
 * - `instagram-story` (1080 × 1920, 9:16): the same card for Instagram Stories, with every
 *   line of text inside the area the Stories interface leaves free.
 *
 * `next/og` supports inline styles only, without CSS variables, so the light theme tokens
 * from globals.css are repeated here.
 */

export type ShareCardFormat = 'link-preview' | 'instagram-post' | 'instagram-story';

type ShareCardLayout = {
  width: number;
  height: number;
  padding: string;
  ruleGap: number;
  wordmarkSize: number;
  kickerSize: number;
  titleSize: { short: number; long: number };
  footerSize: number;
};

/** Margins, in pixels, that the Instagram Stories interface may cover. */
export const INSTAGRAM_STORY_SAFE_AREA = { top: 250, bottom: 340 };

const SHARE_CARD_LAYOUTS: Record<ShareCardFormat, ShareCardLayout> = {
  'link-preview': {
    width: 1200,
    height: 630,
    padding: '64px 80px',
    ruleGap: 44,
    wordmarkSize: 40,
    kickerSize: 20,
    titleSize: { short: 78, long: 60 },
    footerSize: 22,
  },
  'instagram-post': {
    width: 1080,
    height: 1350,
    padding: '96px 88px',
    ruleGap: 48,
    wordmarkSize: 48,
    kickerSize: 24,
    titleSize: { short: 104, long: 80 },
    footerSize: 28,
  },
  'instagram-story': {
    width: 1080,
    height: 1920,
    // Stories covers the top of the image with the progress bar and the account name, and the
    // bottom with the reply field. Text stays out of the top 250 px and the bottom 340 px;
    // the background still fills the whole image.
    padding: `${INSTAGRAM_STORY_SAFE_AREA.top}px 88px ${INSTAGRAM_STORY_SAFE_AREA.bottom}px`,
    ruleGap: 48,
    wordmarkSize: 52,
    kickerSize: 26,
    titleSize: { short: 112, long: 88 },
    footerSize: 30,
  },
};

/** Pixel size of a share card format, for `ImageResponse` and the `size` export of a route. */
export function getShareCardSize(format: ShareCardFormat): { width: number; height: number } {
  const { width, height } = SHARE_CARD_LAYOUTS[format];
  return { width, height };
}

export const OPEN_GRAPH_IMAGE_SIZE = getShareCardSize('link-preview');

const COLORS = {
  background: '#f4f0e8', // --bg
  foreground: '#252522', // --fg
  muted: '#6a665f', // --muted
  line: '#dcd2c3', // --line
  accent: '#652f3b', // --accent
};

const LONG_TITLE_LENGTH = 60;
const MAXIMUM_TITLE_LENGTH = 110;

export type ShareCardContent = {
  /** Small uppercase line above the title, e.g. "Filmes · A casa das marés". */
  kicker?: string;
  title: string;
  /** Line at the bottom, e.g. "Por Filipe Braga · 12 de novembro de 2026". */
  footer: string;
  /** The title in display italic, as on the site's typographic covers and the tagline. */
  isTitleItalic?: boolean;
};

type OpenGraphCardProps = ShareCardContent & {
  format?: ShareCardFormat;
};

function shortenTitle(title: string): string {
  if (title.length <= MAXIMUM_TITLE_LENGTH) {
    return title;
  }
  return `${title.slice(0, MAXIMUM_TITLE_LENGTH).trimEnd()}…`;
}

export function OpenGraphCard({
  kicker,
  title,
  footer,
  isTitleItalic = false,
  format = 'link-preview',
}: OpenGraphCardProps) {
  const layout = SHARE_CARD_LAYOUTS[format];
  const titleFontSize =
    title.length > LONG_TITLE_LENGTH ? layout.titleSize.long : layout.titleSize.short;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: layout.padding,
        backgroundColor: COLORS.background,
        color: COLORS.foreground,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: `3px solid ${COLORS.accent}`,
          paddingLeft: layout.ruleGap,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: DISPLAY_FONT_FAMILY,
            fontWeight: 500,
            fontSize: layout.wordmarkSize,
          }}
        >
          <span>Margem</span>
          <span style={{ margin: '0 11px', fontStyle: 'italic', color: COLORS.accent }}>de</span>
          <span>Cena</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {kicker && (
            <div
              style={{
                fontFamily: INTERFACE_FONT_FAMILY,
                fontWeight: 600,
                fontSize: layout.kickerSize,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: COLORS.accent,
              }}
            >
              {kicker}
            </div>
          )}
          <div
            style={{
              fontFamily: DISPLAY_FONT_FAMILY,
              fontWeight: 500,
              fontStyle: isTitleItalic ? 'italic' : 'normal',
              fontSize: titleFontSize,
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
            }}
          >
            {shortenTitle(title)}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            borderTop: `1px solid ${COLORS.line}`,
            paddingTop: 20,
            fontFamily: INTERFACE_FONT_FAMILY,
            fontWeight: 400,
            fontSize: layout.footerSize,
            color: COLORS.muted,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}

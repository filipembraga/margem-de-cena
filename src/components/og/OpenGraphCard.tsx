import { DISPLAY_FONT_FAMILY, INTERFACE_FONT_FAMILY } from './open-graph-fonts';

/**
 * The image shown when a page is shared (1200 × 630), rendered by `next/og` at build time.
 * `next/og` supports inline styles only, without CSS variables, so the light theme tokens
 * from globals.css are repeated here.
 */

export const OPEN_GRAPH_IMAGE_SIZE = { width: 1200, height: 630 };

const COLORS = {
  background: '#f4f0e8', // --bg
  foreground: '#252522', // --fg
  muted: '#6a665f', // --muted
  line: '#dcd2c3', // --line
  accent: '#652f3b', // --accent
};

const LONG_TITLE_LENGTH = 60;
const MAXIMUM_TITLE_LENGTH = 110;

type OpenGraphCardProps = {
  /** Small uppercase line above the title, e.g. "Filmes · A casa das marés". */
  kicker?: string;
  title: string;
  /** Line at the bottom, e.g. "Por Filipe Braga · 12 de novembro de 2026". */
  footer: string;
  /** The title in display italic, as on the site's typographic covers and the tagline. */
  isTitleItalic?: boolean;
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
}: OpenGraphCardProps) {
  const titleFontSize = title.length > LONG_TITLE_LENGTH ? 60 : 78;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: '64px 80px',
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
          paddingLeft: 44,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: DISPLAY_FONT_FAMILY,
            fontWeight: 500,
            fontSize: 40,
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
                fontSize: 20,
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
            fontSize: 22,
            color: COLORS.muted,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}

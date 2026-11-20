import { DISPLAY_FONT_FAMILY } from './open-graph-fonts';

/**
 * The "Mc" monogram (docs/design-system.md, Wordmark) for the favicon and the home screen
 * icon, rendered by `next/og` with inline styles and the light theme colours.
 */
export function Monogram({ size }: { size: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f0e8', // --bg
        color: '#252522', // --fg
        fontFamily: DISPLAY_FONT_FAMILY,
        fontWeight: 500,
        fontSize: size * 0.72,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}
    >
      <span>M</span>
      <span style={{ fontStyle: 'italic', color: '#652f3b' /* --accent */ }}>c</span>
    </div>
  );
}

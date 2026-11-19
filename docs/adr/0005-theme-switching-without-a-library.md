# 0005. Theme switching without a library

- Status: Accepted
- Date: 2026-11-19

## Context

Light and dark themes are required from day one. The dark theme follows the system
preference, can be toggled, persists, and must not flash on load. `next-themes` is the usual
choice, but its last release was in March 2025, and the behaviour we need is small.

## Decision

- A blocking inline script in the `<head>` of the root layout (a Server Component) resolves
  the theme before first paint. It uses the stored choice if one exists, otherwise
  `prefers-color-scheme`, and sets `data-theme` and `color-scheme` on `<html>`. It is wrapped
  in `try/catch` in case storage is blocked.
- Color tokens are defined in `:root` (light) and `[data-theme="dark"]` (dark), and exposed to
  Tailwind through `@theme`, as specified in the design system.
- The `ThemeToggle` client component reads the current theme through a named hook
  (`useTheme`, built on `useSyncExternalStore`) and persists only explicit choices. Without
  a stored choice, it follows live system changes.
- `<meta name="color-scheme" content="light dark">` and two `theme-color` values (one per
  media query) keep browser chrome consistent.

## Consequences

- No dependency, no flash and no hydration mismatch. `suppressHydrationWarning` is set on
  `<html>` only.
- Visitors with JavaScript disabled get the light theme. This trade-off is accepted to avoid
  duplicating every dark token inside a media query.
- A future Content Security Policy can allow the inline script by hash.
- An end-to-end test asserts that `data-theme` is present at `DOMContentLoaded`, both with a
  stored dark choice and with an emulated dark system preference.

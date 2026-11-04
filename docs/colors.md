# Color ownership

- Site UI colors and shadows belong in `assets/styles/site-tokens.css`, including light, dark, and automatic theme variants.
- Site-owned styles consume `--jw-color-*` and `--jw-shadow-*`. Legacy theme names are aliases declared only at the integration boundary in `site-tokens.css`.
- Component variables may reference semantic tokens, but must not introduce an independent UI palette.
- All navigation drawers use `--jw-color-overlay`; modal search uses `--jw-color-overlay-strong`.
- Search-engine brand colors belong to `data/home/search-engines.yaml`. The decorative quick-dial palette belongs to `data/design.yaml`. Templates emit component variables; JavaScript controls interaction and timing, not palette values.
- Color-picker values and canvas colors are application data. Its fixed contrasting marker and label colors use dedicated tokens and intentionally do not invert with the site theme.
- `currentColor`, `transparent`, and the black alpha mask for text fading are rendering mechanisms, not extra theme colors.
- Vendored theme styles, optional disabled DocSearch, syntax highlighting, and standalone static applications are separate integration scopes. Do not rewrite their palettes as incidental site UI changes.

Validate explicit light/dark themes and automatic theme selection, plus homepage brand colors and color-picker controls, after changing tokens.

## Desktop and mobile effects

- Desktop UI uses opaque surfaces. Jianghu search results and bookmark popovers share `--jw-shadow-popover`: a gray offset block with zero blur and zero spread. Its color adapts to light/dark themes through `--jw-color-shadow-block`.
- Mobile UI may use translucent glass, backdrop blur, and soft shadows. Use `--jw-color-glass` and `--jw-shadow-mobile-popover`; keep these effects inside the mobile breakpoint. Full-screen bookmark menus retain no outer shadow.
- The color-picker label shadow is a functional readability exception over user-selected colors, not desktop popover styling.

- Quick-dial palette entries define `light`/`dark` pairs. The row border and individual link hover/focus use the same row color through `light-dark()`, following the root color scheme. Light tones must retain readable contrast on the hovered row surface; dark tones may use brighter neon hues.

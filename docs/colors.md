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

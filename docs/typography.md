# Typography

The site owns typography through `assets/styles/site-tokens.css`. Do not edit the vendored theme.

- Keep the root font size at `100%` to respect browser preferences.
- Use `--jw-font-body` for interface text and `--jw-font-mono` for code.
- Use the shared `--jw-text-*` scale; do not introduce nearby one-off sizes.
- Use `--jw-text-control` for controls, `--jw-text-navigation` for navigation, and `--jw-text-caption` for supporting text. Controls and navigation switch from `.875rem` to `1rem` at the mobile breakpoint. Supporting text stays `.875rem`.
- Use unitless line heights. Use `rem` for text, scalable control dimensions, and spacing; `px` is appropriate for borders. Use `em` only when intentional scaling with surrounding text is required, such as inline icons.
- Sidebar search and bookmark triggers share `.jw-nav-action`. Define typography, spacing, and alignment there. Component rules only define their different borders and interaction colors.
- Portal content must explicitly use the shared font and size roles rather than rely on the sidebar as its parent.

Validate matching controls at desktop and mobile widths, with default and enlarged root font sizes. Compare font family, size, weight, and line height, rather than the units displayed by developer tools.

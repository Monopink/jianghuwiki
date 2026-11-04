# jianghu wiki

## Project

- Personal Hugo site.
- The product name is jianghu wiki. Strange-Book is only the historical repository/directory name; do not use it for new UI labels or component names.
- Run commands from the repository root.

## Documentation

- [Typography](docs/typography.md): font families, size roles, responsive typography, units, and shared sidebar controls.
- [Color ownership](docs/colors.md): semantic colors, theme variants, palettes, integration boundaries, and permitted exceptions.
- Read the relevant permanent specification before changing shared styles; update it when intentionally changing the standard.
- Files in `docs/plans/` are temporary working documents and may be removed after completion. Do not add them to documentation indexes or depend on them as permanent specifications.

## Structure

- `content.zh/`: Markdown content.
- `data/`: Structured bookmark and application data.
- `layouts/`: Site-level Hugo template overrides.
- `assets/`: Site assets and search index generation.
- `assets/styles/site-tokens.css`: Site-owned typography, colors, shadows, and theme compatibility aliases.
- `assets/styles/index.yaml`: Shared CSS bundle order; theme foundations precede site tokens and component styles.
- `data/design.yaml`: Decorative homepage palette; search-engine brand colors remain in `data/home/search-engines.yaml`.
- `docs/`: Permanent maintenance specifications; `docs/plans/` contains disposable plans.
- `themes/hugo-book/`: Vendored theme; do not edit directly.

## Bookmarks

- Regular bookmarks use `data/bookmarks/*.yaml` and the `bookmarks` layout.
- Applications use `data/apps.yaml` and the `apps` layout.
- Keep item IDs stable after publication; changing an existing ID can break links, references, caches, or external integrations.
- IDs must be unique across the whole data file, not only within one section or category.
- Use lowercase kebab-case IDs based on the item's name or domain, for example `streetvoice`, `mail-yandex`, or `vox-news`.
- Do not create opaque IDs such as `bookmark-<hash>`, numeric-only IDs, IDs containing spaces, or IDs containing status notes.
- When the same category or item name appears in multiple sections, add a meaningful context prefix or suffix, such as `utility-email` or `vox-font-classification`.
- Preserve existing IDs when editing bookmark metadata; only assign a new ID when adding an item or deliberately repairing an invalid ID.
- Keep URLs, names, descriptions, and optional fields aligned with the surrounding entries. Put presentation logic in templates, not in data files.
- After editing structured data, parse the YAML and check for duplicate IDs before handing off the change.

## Structured data changes

- Prefer small, targeted edits to YAML files; do not reorder unrelated entries or reformat the whole file.
- Use the repository's existing field names and indentation style.
- Keep homepage quick links in `data/home/quicklinks.yaml`; do not duplicate them in bookmark data unless the user asks for both.
- When a user asks for an item in a named group, place it in that existing group when possible; create a new subgroup only when no suitable group exists.

## Search

- Search data is generated from page content and structured bookmark data.
- Do not restore the old Markdown-table-based bookmark source.
- Site search and homepage Jianghu search are separate interfaces. Site search uses the sidebar trigger, a desktop dialog, and a full-screen mobile interface; do not place its results inside the sidebar.
- `assets/search.js` owns site search and dialog interaction; `assets/search-preview.js` owns contextual snippets and highlighting. Use actual matched terms, including prefix/fuzzy expansions, and render text safely with text nodes and `mark`, not content interpolated into `innerHTML`.
- Algolia DocSearch configuration and styles are retained as an optional alternative search implementation.
- DocSearch is disabled by default; keep `params.DocSearch.enabled = false` unless deliberately switching search implementations.

## Visual direction

- Maintain a serious, flat, sharp retro-futuristic style: square corners, clear grids, deliberate borders, grayscale text hierarchy, and restrained neon interactions.
- Avoid generic rounded cards, bevels, glow, and decorative textures. Mobile interfaces may use modern glass backgrounds, backdrop blur, and soft shadows; mobile header, sidebar, and TOC intentionally use translucent backgrounds. Desktop interfaces must not use glass or blurred UI shadows: Jianghu search results and bookmark popovers share the solid offset block shadow token. Microblog entries intentionally use separate flat background blocks; homepage brand/decorative colors and overflow text masks are intentional exceptions.
- Normal text and links use grayscale; hover/focus uses the single brand accent unless the component has an explicitly specified color role. Do not invent lighter/darker versions of the brand accent.
- Use icons sparingly and consistently; preserve meaningful section emoji where they are part of the site's identity.

## Style architecture

- Use `jw-*` classes and `--jw-*` site tokens. Do not introduce or restore `sb-*` names, duplicate implementations, or unused compatibility rules.
- Shared typography and UI colors must come from `site-tokens.css`. Component variables may reference semantic tokens; do not create independent palettes in component CSS or JavaScript.
- Use `rem` and shared size roles for text, unitless line heights, and `px` where appropriate for borders. Keep the root font size at `100%`; do not force a fixed pixel root size. Compare computed font family, size, weight, and line height when investigating inconsistencies.
- `.jw-nav-action` owns shared search/bookmark trigger typography, spacing, and alignment. Preserve their intentional border difference: search is 3px, bookmarks 1px. Dialog border width is independent of trigger width.
- Desktop control/navigation text uses `.875rem`, mobile uses `1rem`, and supporting text uses `.875rem`, through the shared semantic roles. Do not add competing parent font shorthands or per-component mobile size patches.
- Site-owned CSS consumes `--jw-color-*` and `--jw-shadow-*`; legacy theme aliases belong only at the integration boundary. Search-engine colors, decorative palette data, and color-picker output are intentional data-driven exceptions. See the color specification for third-party and static application boundaries.
- Consolidate changes in the owning rule instead of appending overrides. Remove superseded declarations; avoid new `!important` rules to fight specificity.
- Portaled menus must explicitly inherit site typography roles and participate in mobile inert, focus, and Escape handling. A higher z-index does not make an inert element interactive.

## Navigation and responsive behavior

- The mobile breakpoint is 56rem. Preserve desktop/mobile separation in TOC behavior: H2 entries stay visible, H3 branches follow scrolling on desktop; mobile shows a simple H2 list with independent scrolling. Do not restore a TOC progress bar or manual branch toggles.
- Sidebar and TOC labels stay on one line. Apply fading only to overflowing text, never to the whole link or its hover background.
- Sidebar first-level expanded groups retain an inset guide line; deeper groups have no additional lines. Third-level entries receive a small indent; deeper levels do not accumulate indentation. Current-page links use text emphasis without an underline or filled background.
- On the homepage, configured default-open sidebar groups expand. Elsewhere, expand only the current page's ancestor path by default.
- Mobile panels must preserve page scroll position on close, support touch scrolling, keyboard focus containment, Escape, and focus restoration without scrolling. Only an intentional TOC link activation may navigate to a heading.
- Gate hover effects with `(hover: hover) and (pointer: fine)`. Touch interactions use `:active`, while keyboard navigation retains `:focus-visible`; do not use persistent pointer focus as touch feedback. Keep the mobile sidebar brand outside the scrollable navigation region.
- Keep mobile control icons consistent in visual size and stroke weight, with accessible names and adequate touch targets. Desktop search expansion animation must not run on mobile or when reduced motion is requested.
- Global tables have transparent headers, a strong header underline, and even body rows filled. Application tables on `/drafts/apps/` independently fill odd rows; their legend follows global rules.

## Windows constraints

The current development environment is Windows 11 / PowerShell 7. Apply these rules when running in PowerShell; verify the actual shell before using Linux-specific commands in another environment.

- Do not use Bash syntax unless the active shell is confirmed to be running in a Linux environment. Do not use Bash quoting, escaping, or heredocs in PowerShell.
- Prefer single-quoted arguments for complex regular expressions. If a pattern contains both single and double quotes, split the search into simpler `rg` calls when practical.
- Put `rg` options before the `--` separator and search paths. Use `--` before patterns beginning with a hyphen, such as CSS custom property names.
- Do not pass wildcard search paths such as `assets/*.js` directly to `rg`. Prefer `rg -g '*.js' 'pattern' assets`, or expand paths with `Get-ChildItem -Filter` before passing them to `rg`.
- Run multiline Python through a PowerShell here-string, not a Bash heredoc:

  ```powershell
  @'
  from pathlib import Path
  print(Path.cwd())
  '@ | python -
  ```

- Do not pass statement blocks such as `foreach` or `if` directly into a pipeline. Assign their output to a variable first, or wrap them in `$()` or `@()`.
- Quote paths containing spaces. Treat command strings as code: PowerShell expands variables and subexpressions inside double-quoted strings; do not interpolate untrusted text or assume JSON escaping is shell escaping.

## Commands

- Development: `hugo server`
- Production build: `hugo --gc --minify`
- Vercel build: `node scripts/build-vercel.cjs`. Build from the source repository; the script attempts to complete shallow Git history directly from the public source repository's HTTPS URL, without relying on checkout remote credentials. If history cannot be verified, build with Git metadata disabled and omit article modification dates; do not fail deployment or substitute build timestamps. Keep the source URL aligned when renaming or transferring the repository. Footer modification dates use the article's Git record and render as plain text; only the edit-page action is linked. GitHub Pages checks out full history and retains article dates independently.
- Run production validation with `hugo --gc --minify` when Hugo is available.
- If Hugo is unavailable, still run a YAML parse and targeted consistency checks, and report the limitation.
- Use `git diff --check` for edits and JavaScript syntax checks when changing scripts. Hugo-templated JavaScript must be checked after template expansion.
- For shared UI changes, check desktop/mobile widths, light/dark/automatic themes, and default/enlarged text as relevant. Verify focus, scrolling, and touch interactions in a browser when changing panel behavior; a successful Hugo build alone is not interaction validation.
- Do not claim checks that were not performed. If Hugo Git metadata fails because of environment ownership restrictions, `hugo --gc --minify --enableGitInfo=false` is an acceptable local validation fallback; report that limitation without changing repository ownership or persistent Git configuration.

# Strange Book

## Project

- Personal Hugo site.
- Run commands from the repository root.

## Structure

- `content.zh/`: Markdown content.
- `data/`: Structured bookmark and application data.
- `layouts/`: Site-level Hugo template overrides.
- `assets/`: Site assets and search index generation.
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
- Algolia DocSearch configuration and styles are retained as an optional alternative search implementation.
- DocSearch is disabled by default; keep `params.DocSearch.enabled = false` unless deliberately switching search implementations.

## Visual direction

- The site uses a flat, sharp Swedish-inspired visual style with restrained millennium-era color accents.
- Prefer clear grids, compact spacing, square or minimally rounded controls, flat color blocks, and thin borders.
- Avoid bevels, skeuomorphic controls, heavy shadows, gradients, glow effects, decorative textures, and excessive rounded cards.
- Use icons sparingly and consistently; preserve meaningful section emoji where they are part of the site's identity.

## Commands

- Development: `hugo server`
- Production build: `hugo --gc --minify`
- Run production validation with `hugo --gc --minify` when Hugo is available.
- If Hugo is unavailable, still run a YAML parse and targeted consistency checks, and report the limitation.

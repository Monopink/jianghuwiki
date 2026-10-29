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

- Regular bookmarks use `data/bookmarks/*.json` and the `bookmarks` layout.
- Applications use `data/apps.json` and the `apps` layout.
- Keep stable item IDs.
- Keep presentation logic in templates, not in data files.

## Search

- Search data is generated from page content and structured bookmark data.
- Do not restore the old Markdown-table-based bookmark source.
- Algolia DocSearch configuration and styles are retained as an optional alternative search implementation.
- DocSearch is disabled by default; keep `params.DocSearch.enabled = false` unless deliberately switching search implementations.

## Commands

- Development: `hugo server`
- Production build: `hugo --gc --minify`

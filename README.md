# PrivJSON — Private, local-first JSON viewer for huge files

**Open your 100MB+ JSON in seconds. The file never leaves your machine.**

PrivJSON is a single-file, zero-dependency HTML app that parses, renders and searches very large JSON entirely in your browser — no upload, no account, no tracking, no build step.

## Why

Popular online JSON formatters were recently caught injecting ads and tracking into pasted data. The alternatives either are closed-source, require upload, or choke on large files. PrivJSON fills the gap: **open-source + 100MB+ + 100% local**.

## Features

- Parse 100MB+ JSON locally (streaming parse in a Web Worker, virtualized rendering)
- Collapsible tree, full-text search, JSON path extraction
- **Zero network requests** — verify in DevTools; works fully offline, forever
- Single `index.html` — no install, no build, host anywhere or just double-click

## Usage

1. Download `index.html`
2. Open it in any modern browser
3. Drop your `.json` file in — everything stays on your device

Or serve it yourself: it is a static file.

## Privacy

- No uploads, no analytics, no third-party requests
- Verifiable: open DevTools → Network tab → load a file → zero requests after page load

## Status & Feedback

MVP v0.1. Issues and feature requests: the GitHub Issues tab (link goes live with the public repo).

## License

MIT — see LICENSE.

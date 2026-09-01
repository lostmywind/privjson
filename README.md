# PrivJSON — private, local-first JSON viewer

**Open your JSON in a single HTML file. The file never leaves your machine.**

PrivJSON is a zero-dependency, single-file HTML app that parses, renders and searches JSON entirely in your browser — no upload, no account, no tracking, no build step.

## Why

Popular online JSON formatters were caught injecting ads and tracking into pasted data. The alternatives are either closed-source, require upload, or choke on large files. PrivJSON fills the gap: **open-source + file-stays-local + offline-capable**.

## Features (all verifiable in code & tests)

- **Parsing off the main thread** — a Web Worker reads + parses the file in the background; the page stays responsive (100 ms UI heartbeat observed during parsing in our tests)
- **Lossless big integers** — integer literals beyond `Number.MAX_SAFE_INTEGER` are preserved exactly (e.g. `9007199254740993123456789`), never silently rounded
- **Full-dataset search** — worker-side, interruptible deep search across the entire data (not just rendered rows); caps at 8M nodes / 5 s per query and says so when capped
- **JSONPath copy** — click any node (with Path-copy mode on) or any search hit to copy its JSONPath; one shared path function guarantees tree and search paths match; keys with spaces/dots use bracket notation (`$.users[1]["post code"]`)
- **Zero network requests** — no analytics, no CDN, no fonts, nothing. Verify: DevTools → Network → load a file → zero requests after page load. Works fully offline.
- **Single `index.html`** — no install, no build; host anywhere or double-click locally
- **Demo data built in** — "Load demo JSON" button lets you try everything without a file

## Honest limitations

- Parsing loads the file as text into memory first (no incremental/streaming parser in this version). A ~100 MB file wants a browser tab with ~1 GB of free memory.
- Tree rendering is bounded to 200 children per node — rendering stays fast; **search still covers the full dataset**.
- Deep search caps at 8M visited nodes or 5 s per query and reports when capped.

## Usage

1. Open the [hosted page](https://lostmywind.github.io/privjson/) — or download `index.html` and double-click it
2. Drop a `.json` file, press Enter/Space to browse, or click **Load demo JSON**
3. Search, expand, switch to table view, copy JSONPaths — everything stays on your device

## Privacy (verifiable, not a promise)

- No uploads, no analytics, no third-party requests — the page makes **zero network requests after load**
- The "Download offline copy" button writes a pristine app template; it never serializes the live DOM, so your data can never leak into it
- Source is ~1300 readable lines in one file — audit it in one coffee break

## Status & Feedback

v0.2. Bugs & feature requests → [GitHub Issues](https://github.com/lostmywind/privjson/issues).

## License

MIT — see [LICENSE](LICENSE).

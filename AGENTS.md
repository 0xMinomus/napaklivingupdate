# Napak Living — Agent Memory

- At session start, read `MEMORY.md` if present; otherwise read `PROJECT.md`. Follow the index to relevant documentation before editing.
- `PROJECT.md` is the shared source of truth for architecture, decisions, and regressions. Use source/configuration for current behavior; documented checks are historical until exercised again.
- After verified work, update the relevant `PROJECT.md` section and the local memory checkpoint with the decision, verification, and any remaining work. Keep each fact in one authoritative place and link to it.
- Obsidian's vault is this repository. `.omp/mcp.json` overrides the global `obsidian` connection. Before MCP writes, confirm `list_directory` contains `PROJECT.md` and `content/`; if it points elsewhere, use project filesystem tools instead.
- `MEMORY.md` is local and Git-ignored. Keep credentials, personal data, and raw transcripts out of notes. Publish repository changes only when the user requests it.

# 🎯 Memory State Machine

**Read in Spanish:** README_ES.md  
**Project Type:** JavaScript (Node.js) — Week 1

---

1. Objetive

Build a small CLI application that captures, persists and manages short notes ("memories") from a terminal using a finite state machine (FSM). The focus is on modeling explicit states and transitions (IDLE, LISTENING, MEMORIZING, ERROR) and on basic persistence and error-recovery patterns.

2. What you should achieve (checklist)

- [ ] Run `node main.js` in a real terminal (TTY) and see the initial help block.
- [ ] Start capture with `Ctrl+S`, type text and finish with `Ctrl+D`; a new entry is appended to `memories.json`.
- [ ] Cancel capture with `Ctrl+X` and verify no memory was created.
- [ ] Simulate a write error (e.g. filesystem permissions) and verify that an entry appears in `error_log.json`.
- [ ] Exit with `Ctrl+C` and avoid leaving the terminal in raw mode (if exit handlers are present).

3. Required knowledge

- Node.js basics and `readline` for terminal input.
- File I/O and JSON handling in Node (`fs`).
- Finite State Machines: states, transitions and allowed actions.
- Terminal TTY and raw mode implications.

4. Quick start

Requirements:
- Node.js v16+

Run:
```bash
# from the project root (no external dependencies required by default)
node main.js
```

Note: `npm install` is not necessary unless you add a `package.json` or dependencies. You can add a `package.json` with a `start` script if you prefer `npm start`.

Main interactive controls:
- `Ctrl+S` — start capturing (LISTENING)
- Typing — append to the input buffer
- `Enter` — insert new line
- `Backspace` — delete character
- `Ctrl+D` — finish and attempt to save (MEMORIZING)
- `Ctrl+X` — cancel input and return to IDLE
- `Ctrl+R` — retry saving when in ERROR
- `Ctrl+C` — exit application

5. Use cases

- Quick terminal notes (ideas, reminders).
- Teaching and experimenting with FSMs in interactive applications.
- Foundation for a simple JSON-backed journal or CLI notebook.

6. Scope (in / out)

In scope:
- FSM-driven CLI input capture and local JSON persistence (`memories.json`).
- Basic error logging to `error_log.json`.

Out of scope (this week):
- GUI/TUI or remote synchronization.
- Automated tests and CI integration (recommended next steps).

7. Future uses

- Add CRUD commands to list, view and delete memories.
- Migrate storage to `fs.promises` and implement atomic writes.
- Port to TypeScript or Rust for stronger typing and ownership practice.

8. Scalability ideas

1. Extract a storage adapter interface and provide JSON/SQLite/remote implementations.
2. Add indexing and search over memories.
3. Run as a background daemon exposing a local HTTP API.

9. Architectural hints

- Keep responsibilities separated: `stateManager` (state + validation), `states` (enter/exit/handlers), `inputHandler` (keyboard/raw), `storage` (persistence + validation).
- Validate content before persisting (size limits, trimming).
- Keep transitions explicit and allow only actions defined per state (`allowedActions`).
- Log errors with useful metadata: `stack`, `attemptedContent`, `timestamp`.

10. Troubleshooting

- Run in a real terminal (TTY). Integrated IDE consoles often do not support raw mode.
- If files fail to write: check permissions and disk space; inspect `memories.json` and `error_log.json` for valid JSON.

11. Limitations & suggested improvements

- Current I/O uses synchronous `fs` calls which can block the event loop; migrate to `fs.promises` and atomic writes.
- `main.js` enables raw mode (`process.stdin.setRawMode(true)`) and may not restore it in all exit paths; adding handlers for `exit`, `SIGINT` and `uncaughtException` is recommended.

12. Reflection (Week 1)

- Modeling interactive behavior as an FSM reduces incidental complexity and clarifies failure/recovery flows.
- The main challenge was reliable raw-mode input handling and safe TTY restoration.
- Next steps: atomic writes, stronger typing (TS), and automated tests.

13. Author & license

- Author: Carlos Enrique Cochero Ramos — GitHub: @caertos  
- License: MIT — see `LICENSE`

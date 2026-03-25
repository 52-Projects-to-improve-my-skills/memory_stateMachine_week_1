# 🎯 Memory State Machine

**Read in Spanish:** `README_ES.md`  
**Project Type:** JavaScript (Node.js) — Week 1

---

## Executive summary

A small console application implementing a finite state machine (FSM) to capture and persist short notes ("memories") from the terminal. The system consciously models states and explicit transitions (IDLE, LISTENING, MEMORIZING, ERROR), ensuring the program only follows valid state changes and exposing clear recovery paths on failure.

This project is part of the "52 Projects" learning series (Week 1) and demonstrates stateful design, separation of concerns, and robust persistence patterns for interactive CLI tools.

---

## Quick start

Prerequisites:
- Node.js v14+

Run:
```bash
# from the project root
npm install      # optional if dependencies are added
node main.js
```

Interactive controls:
- `Ctrl+S` — start capturing input (enter LISTENING)
- Type text — appended to the input buffer
- `Enter` — insert new line
- `Backspace` — delete character
- `Ctrl+D` — finish and attempt to save (enter MEMORIZING)
- `Ctrl+X` — cancel input, return to IDLE
- `Ctrl+R` — when in ERROR, retry saving
- `Ctrl+C` — exit application

Expected initial behavior: a small help block appears and the program waits for `Ctrl+S` to begin capturing.

---

## What this teaches

- Modeling programs as FSMs (states, events, transitions)
- Designing explicit, testable transitions and actions
- Basic file persistence and error recovery patterns
- How to structure a small CLI app with clear module responsibilities

---

## Architecture (high level)

Core responsibilities:
- StateManager: track current state and validate transitions
- States: encapsulate enter/handle/exit behavior for each state
- InputHandler: capture and normalize terminal input
- Storage: persist memories to `memories.json`, log errors to `error_log.json`

Data written:
- `memories.json` — array of memory objects:
```json
[
  {
    "id": 1678890000000,
    "content": "My first memory",
    "timestamp": "2024-03-25T12:34:56.789Z"
  }
]
```
- `error_log.json` — array of error objects with `id`, `timestamp`, `error`, `stack`, `attemptedContent`.

---

## FSM summary

States: `IDLE`, `LISTENING`, `MEMORIZING`, `ERROR`.  
Key transitions:
- `IDLE` —(Ctrl+S)→ `LISTENING`: begin capturing
- `LISTENING` —(Ctrl+D)→ `MEMORIZING`: try to save captured content
- `MEMORIZING` —(success)→ `IDLE`: save succeeded
- `MEMORIZING` —(error)→ `ERROR`: save failed (logged)
- `ERROR` —(Ctrl+R)→ `MEMORIZING`: retry save
- `LISTENING` —(Ctrl+X)→ `IDLE`: cancel input
- `ERROR` —(Ctrl+X)→ `IDLE`: cancel and discard

Explicit transitions prevent invalid internal states and make behavior predictable.

---

## Troubleshooting

- Program not responding: run in a real terminal (TTY), not an embedded IDE console; ensure Node >= 14.
- Error writing files: check write permissions, disk space, and that any existing `memories.json` or `error_log.json` is valid JSON.
- Lost raw input behavior: ensure `process.stdin.setRawMode(false)` is restored on exit (signal handlers recommended).

---

## Limitations & suggested improvements

- Current IO may be synchronous; migrate to `fs.promises` and use atomic writes.
- Add signal handlers to restore TTY state on abrupt exits.
- Add commands to list/read/delete memories and include unit tests.
- Consider a TypeScript rewrite for stronger typing and safer refactors.
- Porting to Rust later is a good exercise to practice enum-based FSMs and ownership.

---

## Reflection (Week 1)

- Building this clarifies that a state machine is more than conditional code: states encapsulate behavior and transitions are first-class constructs.
- Hard part: reliable raw-mode input handling in Node. Solution: use `readline` and proper TTY management.
- Next technical moves: atomic file writes, TypeScript, more robust error handling and tests.

---

## Author & license

- Author: Carlos Enrique Cochero Ramos — GitHub: @caertos  
- License: MIT — see `LICENSE`

# To-Do App — Reactive UI with Subscriber Pattern

## Task Implementation Summary
1. **`store.js` (`subscribe` method):** Added `store.subscribe(listener)` accepting callback functions and returning an `unsubscribe` cleanup function.
2. **`store.js` (Notify on state mutation):** Every mutation (`addTodo`, `toggleTodo`, `deleteTodo`, `setFilter`) updates state and invokes `notify()`, triggering all registered subscribers with the latest state snapshot.
3. **`ui.js` (Register render subscriber):** Registered `render` via `store.subscribe(render)` inside `initTodoUI(store)`.
4. **Automatic Re-renders:** Event listeners only call store actions (`store.addTodo`, `store.toggleTodo`, `store.setFilter`). The UI updates automatically with zero manual `render()` calls after mutations.

## How to Run
Because the project uses ES Modules (`type="module"`), serve the folder with any local static server:
```bash
# Using Python
python -m http.server 5500

# Or VS Code Live Server
# Right-click index.html -> "Open with Live Server"
```
Then open `http://localhost:5500` in your browser.

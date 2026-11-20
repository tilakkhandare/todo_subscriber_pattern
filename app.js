import { createTodoStore } from './store.js';
import { initTodoUI } from './ui.js';

// Initialize store with sample tasks
const store = createTodoStore([
  { id: '1', text: 'Implement store.subscribe(callback)', completed: true },
  { id: '2', text: 'Notify subscribers on add, toggle, and filter changes', completed: true },
  { id: '3', text: 'Verify UI re-renders automatically without manual calls', completed: false },
]);

// Initialize UI module and register subscriber
initTodoUI(store);

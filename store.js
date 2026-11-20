/**
 * Store Module implementing the Observer / Subscriber Pattern
 */
export function createTodoStore(initialTodos = []) {
  let state = {
    todos: [...initialTodos],
    filter: 'all', // 'all' | 'active' | 'completed'
  };

  // Internal list of subscriber callbacks
  const listeners = new Set();

  /**
   * Step 1: Add `subscribe` method to the store that accepts callbacks
   * Returns an unsubscribe function for cleanup.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Expected listener to be a function.');
    }
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  /**
   * Notify all registered subscribers whenever state mutates
   */
  function notify() {
    const snapshot = getState();
    listeners.forEach((listener) => listener(snapshot));
  }

  /**
   * Read-only state accessor with derived filtered list
   */
  function getState() {
    const filteredTodos = state.todos.filter((todo) => {
      if (state.filter === 'active') return !todo.completed;
      if (state.filter === 'completed') return todo.completed;
      return true;
    });

    return {
      todos: [...state.todos],
      filteredTodos,
      filter: state.filter,
      activeCount: state.todos.filter((t) => !t.completed).length,
    };
  }

  /**
   * Step 2: Call subscriber after any state mutation (add, toggle, filter change)
   */
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: trimmed,
      completed: false,
    };

    state = {
      ...state,
      todos: [...state.todos, newTodo],
    };
    notify();
  }

  function toggleTodo(id) {
    state = {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    };
    notify();
  }

  function deleteTodo(id) {
    state = {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    };
    notify();
  }

  function setFilter(filter) {
    if (!['all', 'active', 'completed'].includes(filter)) return;
    if (state.filter === filter) return;

    state = {
      ...state,
      filter,
    };
    notify();
  }

  return {
    subscribe,
    getState,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
  };
}

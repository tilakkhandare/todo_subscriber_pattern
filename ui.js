/**
 * UI Module: Subscribes to store changes and updates the DOM automatically
 */
export function initTodoUI(store) {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const listEl = document.getElementById('todo-list');
  const countEl = document.getElementById('todo-count');
  const renderBadgeEl = document.getElementById('render-badge');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let renderCount = 0;

  // Render function that reacts to store state snapshots
  function render(state) {
    renderCount += 1;
    renderBadgeEl.textContent = `Renders: ${renderCount}`;

    // Update active filter button styling
    filterBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === state.filter);
    });

    // Update remaining items counter
    countEl.textContent = `${state.activeCount} item${state.activeCount === 1 ? '' : 's'} left`;

    // Render filtered list
    listEl.innerHTML = '';

    if (state.filteredTodos.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty-state';
      empty.textContent = 'No tasks in this view.';
      listEl.appendChild(empty);
      return;
    }

    state.filteredTodos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      const left = document.createElement('div');
      left.className = 'todo-item__left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.ariaLabel = `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'completed'}`;

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      left.append(checkbox, span);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✕';
      deleteBtn.ariaLabel = `Delete "${todo.text}"`;

      // Dispatch actions to store (NO manual render() calls needed)
      left.addEventListener('click', () => store.toggleTodo(todo.id));
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.deleteTodo(todo.id);
      });

      li.append(left, deleteBtn);
      listEl.appendChild(li);
    });
  }

  // Step 3: Register the render function as a subscriber on the store
  store.subscribe(render);

  // Wire DOM events to store mutations only (no manual render() calls)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    store.addTodo(input.value);
    input.value = '';
    input.focus();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      store.setFilter(btn.dataset.filter);
    });
  });

  // Initial render from current state
  render(store.getState());
}

// ===== KANBAN.JS =====
const Kanban = (() => {
  let dragId = null;

  function createCard(task) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.dataset.id = task.id;
    card.innerHTML = `
      <div class="card-title">${escHtml(task.title)}</div>
      ${task.desc ? `<div class="card-desc">${escHtml(task.desc)}</div>` : ''}
      <div class="card-footer">
        <button class="card-delete" data-id="${task.id}" title="Delete">✕</button>
      </div>`;

    card.addEventListener('dragstart', e => {
      dragId = task.id;
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      dragId = null;
    });

    card.querySelector('.card-delete').addEventListener('click', e => {
      e.stopPropagation();
      State.deleteTask(task.id);
      render();
    });

    return card;
  }

  function setupDropzone(colEl) {
    colEl.addEventListener('dragover', e => {
      e.preventDefault();
      colEl.classList.add('drag-over');
    });
    colEl.addEventListener('dragleave', () => colEl.classList.remove('drag-over'));
    colEl.addEventListener('drop', e => {
      e.preventDefault();
      colEl.classList.remove('drag-over');
      if (dragId !== null) {
        State.moveTask(dragId, colEl.dataset.col);
        render();
      }
    });
  }

  function render() {
    const cols = ['todo', 'inprogress', 'done'];
    cols.forEach(col => {
      const container = document.getElementById(`cards-${col}`);
      container.innerHTML = '';
      const tasks = State.tasks.filter(t => t.col === col);
      tasks.forEach(t => container.appendChild(createCard(t)));
      document.getElementById(`count-${col}`).textContent = tasks.length;
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function init() {
    // Setup dropzones
    ['todo', 'inprogress', 'done'].forEach(col => {
      setupDropzone(document.getElementById(`cards-${col}`));
    });

    // Add task modal
    document.getElementById('add-task-btn').addEventListener('click', () => {
      document.getElementById('task-modal').classList.remove('hidden');
      document.getElementById('task-title').focus();
    });
    document.getElementById('cancel-task').addEventListener('click', () => {
      document.getElementById('task-modal').classList.add('hidden');
    });
    document.getElementById('save-task').addEventListener('click', () => {
      const title = document.getElementById('task-title').value.trim();
      if (!title) return;
      State.addTask({
        title,
        desc: document.getElementById('task-desc').value.trim(),
        col: document.getElementById('task-col').value,
      });
      document.getElementById('task-title').value = '';
      document.getElementById('task-desc').value = '';
      document.getElementById('task-modal').classList.add('hidden');
      render();
    });

    // Close modal on backdrop click
    document.getElementById('task-modal').addEventListener('click', e => {
      if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
    });

    render();
  }

  return { init, render };
})();
// ===== STATE.JS — Central data store =====
const State = (() => {
  const defaults = {
    tasks: [
      { id: 1, title: 'Design the sidebar layout', desc: 'Create responsive sidebar with nav links', col: 'done' },
      { id: 2, title: 'Build the Kanban board', desc: 'Drag and drop between columns', col: 'inprogress' },
      { id: 3, title: 'Add dark/light mode toggle', desc: '', col: 'todo' },
      { id: 4, title: 'Write the snake game logic', desc: 'requestAnimationFrame game loop', col: 'todo' },
    ],
    notes: [],
    highScore: 0,
    theme: 'dark',
  };

  function load() {
    try {
      const saved = localStorage.getItem('frontend-os-state');
      return saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults };
    } catch { return { ...defaults }; }
  }

  let data = load();

  function save() {
    try { localStorage.setItem('frontend-os-state', JSON.stringify(data)); } catch {}
  }

  return {
    get tasks() { return data.tasks; },
    get notes() { return data.notes; },
    get highScore() { return data.highScore; },
    get theme() { return data.theme; },

    addTask(task) {
      task.id = Date.now();
      data.tasks.push(task);
      save();
    },
    moveTask(id, col) {
      const t = data.tasks.find(t => t.id === id);
      if (t) { t.col = col; save(); }
    },
    deleteTask(id) {
      data.tasks = data.tasks.filter(t => t.id !== id);
      save();
    },
    saveNote(note) {
      const idx = data.notes.findIndex(n => n.id === note.id);
      if (idx >= 0) data.notes[idx] = note;
      else data.notes.push(note);
      save();
    },
    deleteNote(id) {
      data.notes = data.notes.filter(n => n.id !== id);
      save();
    },
    setHighScore(score) {
      if (score > data.highScore) { data.highScore = score; save(); }
    },
    setTheme(t) { data.theme = t; save(); },
  };
})();
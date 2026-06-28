// ===== EDITOR.JS =====
const Editor = (() => {
  let currentNoteId = null;

  function renderNotesList() {
    const list = document.getElementById('notes-list');
    const notes = State.notes;
    if (!notes.length) {
      list.innerHTML = '<li style="color:var(--text3);padding:10px 0">No saved notes yet.</li>';
      return;
    }
    list.innerHTML = notes.map(n => `
      <li class="note-item" data-id="${n.id}">
        <span class="note-item-title">${n.title || 'Untitled'}</span>
        <span class="note-item-date">${new Date(n.id).toLocaleDateString()}</span>
        <button class="note-item-delete" data-id="${n.id}" title="Delete">✕</button>
      </li>`).join('');

    list.querySelectorAll('.note-item').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.classList.contains('note-item-delete')) return;
        loadNote(parseInt(el.dataset.id));
      });
    });
    list.querySelectorAll('.note-item-delete').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        State.deleteNote(parseInt(btn.dataset.id));
        if (currentNoteId === parseInt(btn.dataset.id)) clearEditor();
        renderNotesList();
      });
    });
  }

  function loadNote(id) {
    const note = State.notes.find(n => n.id === id);
    if (!note) return;
    currentNoteId = note.id;
    document.getElementById('note-title').value = note.title || '';
    document.getElementById('editor-content').innerHTML = note.content || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearEditor() {
    currentNoteId = null;
    document.getElementById('note-title').value = '';
    document.getElementById('editor-content').innerHTML = '<p>Start typing your note here…</p>';
  }

  function init() {
    // Toolbar
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd;
        if (cmd.includes(':')) {
          const [c, val] = cmd.split(':');
          document.execCommand(c, false, val);
        } else {
          document.execCommand(cmd, false, null);
        }
        document.getElementById('editor-content').focus();
      });
    });

    // Save note
    document.getElementById('save-note').addEventListener('click', () => {
      const title = document.getElementById('note-title').value.trim();
      const content = document.getElementById('editor-content').innerHTML;
      const note = {
        id: currentNoteId || Date.now(),
        title: title || 'Untitled',
        content,
      };
      State.saveNote(note);
      currentNoteId = note.id;
      renderNotesList();
      // Flash button
      const btn = document.getElementById('save-note');
      btn.textContent = 'Saved ✓';
      setTimeout(() => btn.textContent = 'Save note', 1500);
    });

    // Keyboard shortcut Ctrl+S
    document.getElementById('editor-content').addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('save-note').click();
      }
    });

    renderNotesList();
  }

  function render() {
    renderNotesList();
  }

  return { init, render };
})();
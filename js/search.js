// ===== SEARCH.JS — Global fuzzy search =====
const Search = (() => {
  function fuzzy(str, query) {
    str = str.toLowerCase();
    query = query.toLowerCase();
    let si = 0;
    for (let qi = 0; qi < query.length; qi++) {
      si = str.indexOf(query[qi], si);
      if (si === -1) return false;
      si++;
    }
    return true;
  }

  function highlight(str, query) {
    if (!query) return str;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return str.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  }

  function getResults(query) {
    const results = [];
    State.tasks.forEach(t => {
      if (fuzzy(t.title, query) || (t.desc && fuzzy(t.desc, query))) {
        results.push({ type: 'Task', text: t.title, view: 'kanban' });
      }
    });
    State.notes.forEach(n => {
      if (fuzzy(n.title, query)) {
        results.push({ type: 'Note', text: n.title, view: 'editor' });
      }
    });
    const pages = ['dashboard', 'kanban', 'editor', 'gallery', 'game'];
    pages.forEach(p => {
      if (fuzzy(p, query)) results.push({ type: 'View', text: p.charAt(0).toUpperCase() + p.slice(1), view: p });
    });
    return results.slice(0, 10);
  }

  function renderResults(query) {
    const box = document.getElementById('search-results');
    if (!query.trim()) { box.innerHTML = ''; return; }
    const results = getResults(query);
    if (!results.length) {
      box.innerHTML = '<div class="search-empty">No results found.</div>';
      return;
    }
    box.innerHTML = results.map(r => `
      <div class="search-result" data-view="${r.view}">
        <span class="result-type">${r.type}</span>
        <span class="result-text">${highlight(r.text, query)}</span>
        <span style="font-size:11px;color:var(--text3)">↗</span>
      </div>`).join('');

    box.querySelectorAll('.search-result').forEach(el => {
      el.addEventListener('click', () => {
        close();
        Router.navigate(el.dataset.view);
      });
    });
  }

  function open() {
    document.getElementById('search-overlay').classList.remove('hidden');
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-input').focus();
  }

  function close() {
    document.getElementById('search-overlay').classList.add('hidden');
  }

  function init() {
    document.getElementById('search-trigger').addEventListener('click', open);

    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape') close();
    });

    document.getElementById('search-overlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) close();
    });

    let debounce;
    document.getElementById('search-input').addEventListener('input', e => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderResults(e.target.value), 120);
    });
  }

  return { init };
})();
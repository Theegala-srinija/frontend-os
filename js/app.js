// ===== APP.JS — Main entry point =====
(function () {
  // Theme
  function applyTheme(theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
    document.getElementById('theme-icon').textContent = theme === 'dark' ? '☀' : '☾';
  }

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    State.setTheme(next);
    applyTheme(next);
  });

  applyTheme(State.theme);

  // Init all modules
  Kanban.init();
  Editor.init();
  Gallery.init();
  Game.init();
  Search.init();

  // Wire router to re-render views on navigate
  Router.onEnter('dashboard', () => Dashboard.render());
  Router.onEnter('kanban',    () => Kanban.render());
  Router.onEnter('editor',    () => Editor.render());
  Router.onEnter('gallery',   () => Gallery.render());
  Router.onEnter('game',      () => Game.render());

  // Start router
  Router.init();
})();
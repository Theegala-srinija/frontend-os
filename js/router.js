// ===== ROUTER.JS — Hash-based view router =====
const Router = (() => {
  const views = ['dashboard', 'kanban', 'editor', 'gallery', 'game'];
  const callbacks = {};

  function getView() {
    const hash = location.hash.replace('#', '');
    return views.includes(hash) ? hash : 'dashboard';
  }

  function navigate(view) {
    location.hash = view;
  }

  function activate(view) {
    // Hide all views
    views.forEach(v => {
      document.getElementById(`view-${v}`)?.classList.remove('active');
      document.getElementById(`view-${v}`)?.classList.add('hidden');
    });
    // Show target
    const el = document.getElementById(`view-${view}`);
    if (el) { el.classList.remove('hidden'); el.classList.add('active'); }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('active', a.dataset.view === view);
    });

    // Fire callback
    if (callbacks[view]) callbacks[view]();
  }

  function onEnter(view, fn) {
    callbacks[view] = fn;
  }

  function init() {
    window.addEventListener('hashchange', () => activate(getView()));
    document.querySelectorAll('.nav-item').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        navigate(a.dataset.view);
      });
    });
    activate(getView());
  }

  return { init, navigate, onEnter };
})();
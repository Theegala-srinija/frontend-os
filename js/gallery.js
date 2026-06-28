// ===== GALLERY.JS =====
const Gallery = (() => {
  const images = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/seed/${i + 10}/400/${260 + (i % 5) * 40}`,
    caption: `Photo ${i + 1} — Unsplash collection`,
  }));

  let loaded = 0;
  const pageSize = 8;
  let loading = false;
  let filter = '';
  let observer = null;

  function renderBatch() {
    if (loading) return;
    loading = true;
    const grid = document.getElementById('gallery-grid');

    // Show skeletons
    const skeletons = Array.from({ length: 4 }, () => {
      const sk = document.createElement('div');
      sk.className = 'gallery-skeleton';
      sk.style.height = `${140 + Math.random() * 80}px`;
      grid.appendChild(sk);
      return sk;
    });

    const filtered = images.filter(img =>
      !filter || img.caption.toLowerCase().includes(filter.toLowerCase())
    );

    setTimeout(() => {
      skeletons.forEach(sk => sk.remove());
      const batch = filtered.slice(loaded, loaded + pageSize);
      batch.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
          <img src="${img.src}" alt="${img.caption}" loading="lazy" />
          <div class="gallery-caption">${img.caption}</div>`;
        item.addEventListener('click', () => openLightbox(img));
        grid.appendChild(item);
      });
      loaded += batch.length;
      loading = false;
      if (loaded >= filtered.length && observer) observer.disconnect();
    }, 600);
  }

  function openLightbox(img) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-caption').textContent = img.caption;
    lb.classList.remove('hidden');
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
    document.getElementById('lightbox-img').src = '';
  }

  function init() {
    document.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    document.getElementById('gallery-search').addEventListener('input', e => {
      filter = e.target.value;
      loaded = 0;
      document.getElementById('gallery-grid').innerHTML = '';
      renderBatch();
    });
  }

  function render() {
    loaded = 0;
    document.getElementById('gallery-grid').innerHTML = '';

    // Disconnect old observer
    if (observer) observer.disconnect();

    renderBatch();

    // Infinite scroll
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) renderBatch();
    }, { rootMargin: '200px' });
    const sentinel = document.getElementById('gallery-sentinel');
    if (sentinel) observer.observe(sentinel);
  }

  return { init, render };
})();
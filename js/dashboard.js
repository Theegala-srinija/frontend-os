// ===== DASHBOARD.JS =====
const Dashboard = (() => {
  function drawChart() {
    const canvas = document.getElementById('activity-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth || 700;
    canvas.width = W;
    const H = 200;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [3, 7, 5, 9, 6, 4, 8];
    const max = Math.max(...data);
    const pad = { top: 20, right: 20, bottom: 30, left: 30 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = chartW / days.length * 0.5;
    const gap = chartW / days.length;

    // Style
    const isDark = document.body.classList.contains('theme-dark');
    const gridColor = isDark ? '#2a2a38' : '#e0e0ee';
    const textColor = isDark ? '#5a5a78' : '#9090b0';
    const barColor = '#6c63ff';
    const barColorHover = '#8b83ff';

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    }

    // Bars
    days.forEach((day, i) => {
      const x = pad.left + gap * i + gap / 2 - barW / 2;
      const barH = (data[i] / max) * chartH;
      const y = pad.top + chartH - barH;

      // Bar with rounded top
      ctx.fillStyle = barColor;
      ctx.beginPath();
      const r = 4;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();

      // Value label
      ctx.fillStyle = barColorHover;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data[i], x + barW / 2, y - 6);

      // Day label
      ctx.fillStyle = textColor;
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(day, x + barW / 2, H - 8);
    });
  }

  function render() {
    const tasks = State.tasks;
    document.getElementById('stat-tasks').textContent = tasks.filter(t => t.col === 'done').length;
    document.getElementById('stat-notes').textContent = State.notes.length;
    document.getElementById('stat-score').textContent = State.highScore;

    // Recent tasks
    const list = document.getElementById('recent-tasks');
    const recent = [...tasks].slice(-5).reverse();
    list.innerHTML = recent.length
      ? recent.map(t => `
          <li>
            <span>${t.title}</span>
            <span class="task-tag tag-${t.col}">${t.col === 'inprogress' ? 'In progress' : t.col.charAt(0).toUpperCase() + t.col.slice(1)}</span>
          </li>`).join('')
      : '<li style="color:var(--text3)">No tasks yet — add some in Kanban!</li>';

    setTimeout(drawChart, 50);
  }

  return { render };
})();
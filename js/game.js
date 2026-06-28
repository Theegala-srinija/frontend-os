// ===== GAME.JS — Snake =====
const Game = (() => {
  const CELL = 20;
  const COLS = 20;
  const ROWS = 20;

  let canvas, ctx;
  let snake, dir, nextDir, food, score, best, gameLoop, running, paused;

  function rand(n) { return Math.floor(Math.random() * n); }

  function spawnFood() {
    let pos;
    do { pos = { x: rand(COLS), y: rand(ROWS) }; }
    while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  function reset() {
    snake = [
      { x: 10, y: 10 },
      { x: 9,  y: 10 },
      { x: 8,  y: 10 },
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    food = spawnFood();
    score = 0;
    updateHUD();
  }

  function draw() {
    const isDark = document.body.classList.contains('theme-dark');
    const bg = isDark ? '#16161d' : '#f4f4f8';
    const gridColor = isDark ? '#1e1e28' : '#eaeaf2';
    const snakeColor = '#6c63ff';
    const snakeHead = '#8b83ff';
    const foodColor = '#3ecf8e';
    const textColor = isDark ? '#5a5a78' : '#9090b0';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(canvas.width, y * CELL); ctx.stroke();
    }

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? snakeHead : snakeColor;
      const r = i === 0 ? 6 : 4;
      roundRect(ctx, seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, r);
      ctx.fill();
    });

    // Food
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Paused overlay
    if (paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '600 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function step() {
    if (paused || !running) return;

    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return endGame();
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) return endGame();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      food = spawnFood();
      updateHUD();
    } else {
      snake.pop();
    }

    draw();
  }

  function updateHUD() {
    document.getElementById('game-score').textContent = score;
    best = Math.max(score, State.highScore);
    State.setHighScore(score);
    document.getElementById('game-best').textContent = best;
    document.getElementById('stat-score').textContent = best;
  }

  function endGame() {
    running = false;
    clearInterval(gameLoop);
    State.setHighScore(score);
    const overlay = document.getElementById('game-overlay');
    document.getElementById('game-msg').textContent = `Game over! Score: ${score}`;
    document.getElementById('game-start-btn').textContent = 'Play again';
    overlay.classList.remove('hidden');
  }

  function startGame() {
    reset();
    running = true;
    paused = false;
    clearInterval(gameLoop);
    gameLoop = setInterval(step, 120);
    document.getElementById('game-overlay').classList.add('hidden');
    draw();
  }

  function togglePause() {
    if (!running) return;
    paused = !paused;
    if (!paused) draw();
  }

  function handleKey(e) {
    const map = {
      ArrowUp:    { x: 0, y: -1 }, w: { x: 0, y: -1 },
      ArrowDown:  { x: 0, y: 1 },  s: { x: 0, y: 1 },
      ArrowLeft:  { x: -1, y: 0 }, a: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },  d: { x: 1, y: 0 },
    };
    const d = map[e.key];
    if (d) {
      // Prevent reversing
      if (d.x !== -dir.x || d.y !== -dir.y) nextDir = d;
      e.preventDefault();
    }
    if (e.key === ' ') { e.preventDefault(); togglePause(); }
  }

  function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    document.getElementById('game-start-btn').addEventListener('click', startGame);
    document.addEventListener('keydown', handleKey);

    // Touch controls
    let touchStart = null;
    canvas.addEventListener('touchstart', e => {
      touchStart = e.touches[0];
    });
    canvas.addEventListener('touchend', e => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.clientX;
      const dy = e.changedTouches[0].clientY - touchStart.clientY;
      if (Math.abs(dx) > Math.abs(dy)) {
        nextDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        nextDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }
    });

    draw();
  }

  function render() {
    best = State.highScore;
    document.getElementById('game-best').textContent = best;
    if (!running) draw();
  }

  return { init, render };
})();
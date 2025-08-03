let gridSize = 4;
let sequence = [];
let userSequence = [];
let cells = [];
let acceptingInput = false;
let level = 1;
let highScore = localStorage.getItem('pandaHighScore') || 0;

const statusMsg = document.getElementById("status");
const levelLabel = document.getElementById("level-info");
const retryBtn = document.getElementById("retry-btn");

function showGridSelection() {
  hideAllScreens();
  document.getElementById("grid-selection").classList.add("show");
}

function startGame() {
  const sizeInput = document.getElementById("grid-size");
  gridSize = sizeInput ? parseInt(sizeInput.value) : 4;
  sequence = [];
  level = 1;

  hideAllScreens();
  document.getElementById("game-screen").classList.add("show");

  createGrid(gridSize);
  updateLevel();
  startLevel();
}

function createGrid(size) {
  const container = document.getElementById("maze-container");
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  cells = [];

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = '🐼';
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleUserClick(i));
    container.appendChild(cell);
    cells.push(cell);
  }
}

function startLevel() {
  userSequence = [];
  sequence.push(Math.floor(Math.random() * (gridSize * gridSize)));
  showSequence();
  updateLevel();
  retryBtn.style.display = 'none';
  clearWrongHighlights();
}

function showSequence() {
  acceptingInput = false;
  let i = 0;
  const interval = setInterval(() => {
    flashCell(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      acceptingInput = true;
      showMessage("Your turn! 🧠");
    }
  }, 600);
}

function flashCell(index) {
  const cell = cells[index];
  if (!cell) return;

  cell.classList.add('flash');
  playBeep();
  setTimeout(() => cell.classList.remove('flash'), 300);
}

function handleUserClick(index) {
  if (!acceptingInput) return;

  userSequence.push(index);
  const step = userSequence.length - 1;
  flashCell(index);

  if (index !== sequence[step]) {
    cells[index].classList.add('wrong');
    showMessage("❌ Wrong!");
    retryBtn.style.display = 'block';
    acceptingInput = false;
    return;
  }

  if (userSequence.length === sequence.length) {
    level++;
    setTimeout(startLevel, 800);
  }
}

function retryGame() {
  sequence = [];
  userSequence = [];
  level = 1;
  retryBtn.style.display = 'none';
  clearWrongHighlights();
  updateLevel();
  startLevel();
}

function clearWrongHighlights() {
  cells.forEach(cell => {
    cell.classList.remove('wrong');
  });
}

function updateLevel() {
  if (level - 1 > highScore) {
    highScore = level - 1;
    localStorage.setItem('pandaHighScore', highScore);
  }
  levelLabel.textContent = `⭐ Level: ${level} | 🏆 High Score: ${highScore}`;
}


function showMessage(text) {
  statusMsg.textContent = text;
  statusMsg.classList.add('show');
  setTimeout(() => statusMsg.classList.remove('show'), 2000);
}

function playBeep(freq = 400) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.value = 0.1;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function hideAllScreens() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('show'));
}

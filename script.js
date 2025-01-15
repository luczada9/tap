const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

// Configurações do canvas
canvas.width = 400;
canvas.height = 400;

const rows = 4; // Layout fixo 4x4
const cols = 4;
const tileWidth = canvas.width / cols;
const tileHeight = canvas.height / rows;

let tiles = [];
let score = 0;
let timeLeft = 30;
const numBlackTiles = 3; // Número de alvos pretos

// Inicializa os blocos
function initTiles() {
  tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      tiles.push({
        x: col * tileWidth,
        y: row * tileHeight,
        color: 'white', // Todos começam brancos
      });
    }
  }
  // Define os alvos pretos iniciais
  setRandomBlackTiles();
  drawTiles();
}

// Define tiles aleatórios como pretos
function setRandomBlackTiles() {
  // Reseta todos os tiles para branco
  tiles.forEach(tile => (tile.color = 'white'));
  // Escolhe múltiplos tiles aleatórios para serem pretos
  for (let i = 0; i < numBlackTiles; i++) {
    const randomIndex = Math.floor(Math.random() * tiles.length);
    tiles[randomIndex].color = 'black'; // Preto
  }
}

// Move apenas o tile clicado para uma nova posição
function moveClickedTile(tile) {
  // Encontra uma posição vazia (branca) aleatória
  let newPosition;
  do {
    const randomIndex = Math.floor(Math.random() * tiles.length);
    newPosition = tiles[randomIndex];
  } while (newPosition.color === 'black'); // Garante que a posição não seja de outro alvo preto

  // Troca as cores entre a posição atual e a nova
  newPosition.color = 'black'; // Novo alvo
  tile.color = 'white'; // O alvo anterior volta a ser branco
}

// Renderiza os blocos e linhas de separação
function drawTiles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha os blocos
  tiles.forEach(tile => {
    ctx.fillStyle = tile.color;
    ctx.fillRect(tile.x, tile.y, tileWidth, tileHeight);
    ctx.strokeStyle = 'white'; // Borda branca ao redor dos blocos
    ctx.strokeRect(tile.x, tile.y, tileWidth, tileHeight);
  });

  // Desenha as linhas de separação em azul
  ctx.strokeStyle = '#0000FF'; // Azul
  ctx.lineWidth = 2;

  for (let i = 1; i < rows; i++) {
    // Linha horizontal
    ctx.beginPath();
    ctx.moveTo(0, i * tileHeight);
    ctx.lineTo(canvas.width, i * tileHeight);
    ctx.stroke();

    // Linha vertical
    ctx.beginPath();
    ctx.moveTo(i * tileWidth, 0);
    ctx.lineTo(i * tileWidth, canvas.height);
    ctx.stroke();
  }
}

// Atualiza o placar
function updateScore() {
  scoreDisplay.textContent = `Pontuação: ${score}`;
}

// Atualiza o tempo
function updateTimer() {
  timerDisplay.textContent = timeLeft.toFixed(1);
}

// Detecta cliques no canvas
canvas.addEventListener('click', event => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  let clickedTile = null;

  tiles.forEach(tile => {
    if (
      x > tile.x &&
      x < tile.x + tileWidth &&
      y > tile.y &&
      y < tile.y + tileHeight
    ) {
      clickedTile = tile;
    }
  });

  if (clickedTile) {
    if (clickedTile.color === 'black') { // Preto
      score++;
      updateScore();
      moveClickedTile(clickedTile); // Move apenas o alvo clicado
      drawTiles();
    } else {
      alert('Game Over! Você clicou no tile errado.');
      resetGame();
    }
  }
});

// Cronômetro do jogo
function startTimer() {
  const interval = setInterval(() => {
    timeLeft -= 0.1;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(interval);
      alert(`Tempo esgotado! Sua pontuação final foi: ${score}`);
      resetGame();
    }
  }, 100);
}

// Reinicia o jogo
function resetGame() {
  score = 0;
  timeLeft = 30;
  updateScore();
  updateTimer();
  initTiles();
}

// Inicialização
initTiles();
updateScore();
updateTimer();
startTimer();

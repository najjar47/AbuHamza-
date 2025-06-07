/*
  لعبة 2048 بواسطة AbuHamza🔻
*/

let grid = [];
let score = 0;

const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const moveSound = document.getElementById("move-sound");
const mergeSound = document.getElementById("merge-sound");
const startBtn = document.getElementById("start-btn");

function init() {
  grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  score = 0;
  updateScore();
  addRandom();
  addRandom();
  draw();
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function addRandom() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length > 0) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function draw() {
  game.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = grid[r][c];
      const cell = document.createElement("div");
      cell.className = "cell";
      if (val !== 0) {
        cell.classList.add("tile-" + val);
        cell.textContent = val;
      }
      game.appendChild(cell);
    }
  }
}

function move(dir) {
  let moved = false;

  for (let i = 0; i < 4; i++) {
    let line = [];
    for (let j = 0; j < 4; j++) {
      const val = dir === "left" || dir === "right" ? grid[i][j] : grid[j][i];
      line.push(val);
    }

    if (dir === "right" || dir === "down") line.reverse();

    let newLine = line.filter(n => n !== 0);

    for (let k = 0; k < newLine.length - 1; k++) {
      if (newLine[k] === newLine[k + 1]) {
        newLine[k] *= 2;
        score += newLine[k];
        mergeSound.play();
        newLine[k + 1] = 0;
      }
    }

    newLine = newLine.filter(n => n !== 0);
    while (newLine.length < 4) newLine.push(0);
    if (dir === "right" || dir === "down") newLine.reverse();

    for (let j = 0; j < 4; j++) {
      const val = newLine[j];
      if (dir === "left" || dir === "right") {
        if (grid[i][j] !== val) moved = true;
        grid[i][j] = val;
      } else {
        if (grid[j][i] !== val) moved = true;
        grid[j][i] = val;
      }
    }
  }

  if (moved) {
    addRandom();
    moveSound.play();
    draw();
    updateScore();

    if (isGameOver()) {
      alert("انتهت اللعبة! لا يوجد أي تحرك ممكن.");
    }
  }
}

function isGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
    }
  }

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r][c] === grid[r][c + 1]) return false;
    }
  }

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 3; r++) {
      if (grid[r][c] === grid[r + 1][c]) return false;
    }
  }

  return true;
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": move("left"); break;
    case "ArrowRight": move("right"); break;
    case "ArrowUp": move("up"); break;
    case "ArrowDown": move("down"); break;
  }
});

startBtn.addEventListener("click", () => {
  init();
  startBtn.textContent = "🔄 إعادة اللعبة";
});

let shots = 0;
let goals = 0;
const maxShots = 5;
let gameOver = false;
let lockShot = false;

const shotsEl = document.getElementById("shots");
const goalsEl = document.getElementById("goals");
const difficultyEl = document.getElementById("difficulty");
const messageEl = document.getElementById("message");
const goalkeeperEl = document.getElementById("goalkeeper");
const ballEl = document.getElementById("ball");
const shotDirectionEl = document.getElementById("shotDirection");

const options = ["izquierda", "centro", "derecha"];

function updateScore() {
  shotsEl.textContent = `${shots} / ${maxShots}`;
  goalsEl.textContent = goals;

  if (shots < 2) {
    difficultyEl.textContent = "Fácil";
  } else if (shots < 4) {
    difficultyEl.textContent = "Medio";
  } else {
    difficultyEl.textContent = "Difícil";
  }
}

function getKeeperChoice() {
  const difficulty = shots < 2 ? "facil" : shots < 4 ? "medio" : "dificil";
  let keeperChoice;

  if (difficulty === "facil") {
    keeperChoice = options[Math.floor(Math.random() * options.length)];
  } else if (difficulty === "medio") {
    keeperChoice = Math.random() < 0.45
      ? null
      : options[Math.floor(Math.random() * options.length)];
  } else {
    keeperChoice = Math.random() < 0.6
      ? null
      : options[Math.floor(Math.random() * options.length)];
  }

  return keeperChoice || options[Math.floor(Math.random() * options.length)];
}

function moveGoalkeeper(direction) {
  if (direction === "izquierda") {
    goalkeeperEl.style.left = "25%";
    goalkeeperEl.style.transform = "translateX(-50%) rotate(-8deg)";
  } else if (direction === "centro") {
    goalkeeperEl.style.left = "50%";
    goalkeeperEl.style.transform = "translateX(-50%)";
  } else {
    goalkeeperEl.style.left = "75%";
    goalkeeperEl.style.transform = "translateX(-50%) rotate(8deg)";
  }
}

function animateBall(direction) {
  let leftValue = "50%";
  let bottomValue = "170px";
  let xTranslate = "-50%";

  if (direction === "izquierda") {
    leftValue = "23%";
    xTranslate = "-50%";
  } else if (direction === "centro") {
    leftValue = "50%";
    xTranslate = "-50%";
  } else {
    leftValue = "77%";
    xTranslate = "-50%";
  }

  ballEl.style.left = leftValue;
  ballEl.style.bottom = bottomValue;
  ballEl.style.transform = `translateX(${xTranslate}) scale(0.72)`;

  setTimeout(() => {
    ballEl.style.left = "50%";
    ballEl.style.bottom = "50px";
    ballEl.style.transform = "translateX(-50%) scale(1)";
  }, 600);
}

function getDirectionLabel(direction) {
  if (direction === "izquierda") return "izquierda";
  if (direction === "centro") return "al centro";
  return "derecha";
}

function finishGame() {
  gameOver = true;

  if (goals === 5) {
    messageEl.textContent = "🏆 Increíble. Metiste los 5 penales. Sos una bestia.";
  } else if (goals >= 4) {
    messageEl.textContent = `🔥 Terminaste con ${goals} goles. Tremenda tanda.`;
  } else if (goals >= 3) {
    messageEl.textContent = `⚽ Hiciste ${goals} goles. Muy buena tanda.`;
  } else {
    messageEl.textContent = `😅 Terminaste con ${goals} goles. Probá otra vez y rompela.`;
  }

  shotDirectionEl.textContent = "Tanda finalizada.";
}

function shoot(direction) {
  if (gameOver || lockShot) {
    return;
  }

  lockShot = true;
  shotDirectionEl.textContent = `Elegiste patear hacia ${getDirectionLabel(direction)}...`;

  const keeperChoice = getKeeperChoice();

  animateBall(direction);

  setTimeout(() => {
    moveGoalkeeper(keeperChoice);
  }, 120);

  setTimeout(() => {
    shots++;

    if (direction === keeperChoice) {
      messageEl.textContent = `🧤 ¡Atajó! El arquero fue a ${getDirectionLabel(keeperChoice)}.`;
    } else {
      goals++;
      messageEl.textContent = `⚽ ¡GOOOL! Pateaste ${getDirectionLabel(direction)} y el arquero fue ${getDirectionLabel(keeperChoice)}.`;
    }

    updateScore();

    if (shots >= maxShots) {
      setTimeout(() => {
        finishGame();
        lockShot = false;
      }, 500);
    } else {
      setTimeout(() => {
        shotDirectionEl.textContent = "Esperando tu próximo disparo...";
        goalkeeperEl.style.left = "50%";
        goalkeeperEl.style.transform = "translateX(-50%)";
        lockShot = false;
      }, 500);
    }
  }, 650);
}

function restartGame() {
  shots = 0;
  goals = 0;
  gameOver = false;
  lockShot = false;

  goalkeeperEl.style.left = "50%";
  goalkeeperEl.style.transform = "translateX(-50%)";
  ballEl.style.left = "50%";
  ballEl.style.bottom = "50px";
  ballEl.style.transform = "translateX(-50%) scale(1)";

  messageEl.textContent = "Preparado para patear.";
  shotDirectionEl.textContent = "Esperando tu disparo...";

  updateScore();
}

updateScore();
const teams = [
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Brasil", flag: "🇧🇷" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Perú", flag: "🇵🇪" },
  { name: "México", flag: "🇲🇽" },
  { name: "Estados Unidos", flag: "🇺🇸" },
  { name: "España", flag: "🇪🇸" },
  { name: "Francia", flag: "🇫🇷" },
  { name: "Alemania", flag: "🇩🇪" },
  { name: "Italia", flag: "🇮🇹" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Inglaterra", flag: "🇬🇧" },
  { name: "Países Bajos", flag: "🇳🇱" },
  { name: "Croacia", flag: "🇭🇷" },
  { name: "Bélgica", flag: "🇧🇪" },
  { name: "Japón", flag: "🇯🇵" },
  { name: "Corea del Sur", flag: "🇰🇷" }
];

const playerTeamSelect = document.getElementById("playerTeam");
const cpuTeamSelect = document.getElementById("cpuTeam");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const playerFlag = document.getElementById("playerFlag");
const cpuFlag = document.getElementById("cpuFlag");
const playerTeamName = document.getElementById("playerTeamName");
const cpuTeamName = document.getElementById("cpuTeamName");
const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");

const roundText = document.getElementById("roundText");
const turnText = document.getElementById("turnText");
const stateText = document.getElementById("stateText");
const phaseText = document.getElementById("phaseText");
const actionTitle = document.getElementById("actionTitle");
const playerTrack = document.getElementById("playerTrack");
const cpuTrack = document.getElementById("cpuTrack");
const messageEl = document.getElementById("message");
const shotInfo = document.getElementById("shotInfo");

const keeperEl = document.getElementById("keeper");
const ballEl = document.getElementById("ball");

const powerInput = document.getElementById("powerInput");
const accuracyInput = document.getElementById("accuracyInput");
const powerValue = document.getElementById("powerValue");
const accuracyValue = document.getElementById("accuracyValue");

const directions = ["izquierda", "centro", "derecha"];

let game = {};

function fillTeams() {
  teams.forEach(team => {
    const a = document.createElement("option");
    a.value = team.name;
    a.textContent = `${team.flag} ${team.name}`;
    playerTeamSelect.appendChild(a);

    const b = document.createElement("option");
    b.value = team.name;
    b.textContent = `${team.flag} ${team.name}`;
    cpuTeamSelect.appendChild(b);
  });

  playerTeamSelect.value = "Argentina";
  cpuTeamSelect.value = "Brasil";
}

function teamByName(name) {
  return teams.find(t => t.name === name);
}

function resetGame() {
  game = {
    playerTeam: teamByName(playerTeamSelect.value),
    cpuTeam: teamByName(cpuTeamSelect.value),
    playerScore: 0,
    cpuScore: 0,
    playerShots: 0,
    cpuShots: 0,
    round: 1,
    phase: "player-kick",
    playerResults: [],
    cpuResults: [],
    gameOver: false,
    busy: false
  };

  if (game.playerTeam.name === game.cpuTeam.name) {
    const other = teams.find(t => t.name !== game.playerTeam.name);
    game.cpuTeam = other;
    cpuTeamSelect.value = other.name;
  }

  powerInput.value = 50;
  accuracyInput.value = 75;
  updateMeterLabels();
  updateUI();
  resetField();

  messageEl.textContent = `Arrancó la tanda entre ${game.playerTeam.name} y ${game.cpuTeam.name}.`;
  shotInfo.textContent = "Elegí dirección de tiro.";
}

function updateMeterLabels() {
  powerValue.textContent = powerInput.value;
  accuracyValue.textContent = accuracyInput.value;
}

function updateUI() {
  playerFlag.textContent = game.playerTeam.flag;
  cpuFlag.textContent = game.cpuTeam.flag;
  playerTeamName.textContent = game.playerTeam.name;
  cpuTeamName.textContent = game.cpuTeam.name;

  playerScoreEl.textContent = game.playerScore;
  cpuScoreEl.textContent = game.cpuScore;
  roundText.textContent = game.round;

  let turnLabel = "Tu disparo";
  if (game.phase === "cpu-kick") turnLabel = "Tu atajada";
  if (game.phase === "sudden-player") turnLabel = "Muerte súbita: tu disparo";
  if (game.phase === "sudden-cpu") turnLabel = "Muerte súbita: tu atajada";

  turnText.textContent = turnLabel;
  actionTitle.textContent = turnLabel;
  phaseText.textContent = game.round > 5 ? "Muerte súbita" : "Tanda de penales";
  stateText.textContent = game.gameOver ? "Finalizado" : "Jugando";

  renderTrackers();
}

function renderTrackers() {
  playerTrack.innerHTML = "";
  cpuTrack.innerHTML = "";

  game.playerResults.forEach(result => {
    const dot = document.createElement("div");
    dot.className = `track-dot ${result ? "goal" : "miss"}`;
    playerTrack.appendChild(dot);
  });

  game.cpuResults.forEach(result => {
    const dot = document.createElement("div");
    dot.className = `track-dot ${result ? "goal" : "miss"}`;
    cpuTrack.appendChild(dot);
  });
}

function resetField() {
  keeperEl.style.left = "50%";
  keeperEl.style.transform = "translateX(-50%)";
  ballEl.style.left = "50%";
  ballEl.style.bottom = "50px";
  ballEl.style.transform = "translateX(-50%) scale(1)";
}

function moveKeeper(direction, isPlayerKeeper = false) {
  let left = "50%";
  let transform = "translateX(-50%)";

  if (direction === "izquierda") {
    left = "25%";
    transform = "translateX(-50%) rotate(-10deg)";
  } else if (direction === "centro") {
    left = "50%";
    transform = "translateX(-50%) scale(1.03)";
  } else if (direction === "derecha") {
    left = "75%";
    transform = "translateX(-50%) rotate(10deg)";
  }

  keeperEl.style.left = left;
  keeperEl.style.transform = transform;
}

function directionLabel(direction) {
  if (direction === "izquierda") return "izquierda";
  if (direction === "centro") return "al centro";
  return "derecha";
}

function randomDirection() {
  return directions[Math.floor(Math.random() * directions.length)];
}

function animateBall(direction, power) {
  let left = "50%";
  if (direction === "izquierda") left = "23%";
  if (direction === "centro") left = "50%";
  if (direction === "derecha") left = "77%";

  const maxBottom = 165 + Math.round(power * 0.5);

  ballEl.style.left = left;
  ballEl.style.bottom = `${maxBottom}px`;
  ballEl.style.transform = "translateX(-50%) scale(0.72)";
}

function evaluateEarlyWin() {
  const playerRemaining = 5 - game.playerShots;
  const cpuRemaining = 5 - game.cpuShots;

  if (game.playerScore > game.cpuScore + cpuRemaining) return "player";
  if (game.cpuScore > game.playerScore + playerRemaining) return "cpu";
  return null;
}

function finishGame(winner) {
  game.gameOver = true;
  updateUI();

  if (winner === "player") {
    messageEl.textContent = `🏆 ¡Ganó ${game.playerTeam.name}! Le ganaste a ${game.cpuTeam.name} en la tanda.`;
  } else {
    messageEl.textContent = `😓 Ganó ${game.cpuTeam.name}. Probá otra vez y buscá revancha.`;
  }

  shotInfo.textContent = "Partido terminado.";
}

function goNextPhase() {
  if (game.gameOver) return;

  if (game.round <= 5) {
    const early = evaluateEarlyWin();
    if (early) {
      finishGame(early);
      return;
    }
  }

  if (game.phase === "player-kick") {
    game.phase = "cpu-kick";
  } else if (game.phase === "cpu-kick") {
    if (game.round < 5) {
      game.round += 1;
      game.phase = "player-kick";
    } else {
      if (game.playerScore !== game.cpuScore) {
        finishGame(game.playerScore > game.cpuScore ? "player" : "cpu");
        return;
      }
      game.round += 1;
      game.phase = "sudden-player";
      messageEl.textContent = "🔥 Empieza la muerte súbita.";
    }
  } else if (game.phase === "sudden-player") {
    game.phase = "sudden-cpu";
  } else if (game.phase === "sudden-cpu") {
    const lastPlayer = game.playerResults[game.playerResults.length - 1];
    const lastCpu = game.cpuResults[game.cpuResults.length - 1];

    if (lastPlayer !== lastCpu) {
      finishGame(lastPlayer ? "player" : "cpu");
      return;
    }

    game.round += 1;
    game.phase = "sudden-player";
    messageEl.textContent = "🔥 Sigue la muerte súbita.";
  }

  updateUI();

  if (!game.gameOver) {
    shotInfo.textContent =
      game.phase === "player-kick" || game.phase === "sudden-player"
        ? "Elegí dirección de tiro."
        : "Elegí hacia dónde te tirás.";
  }
}

function shotMissesByPowerAndAccuracy(power, accuracy) {
  const missChance = Math.max(3, Math.round((100 - accuracy) * 0.22 + Math.max(0, power - 88) * 0.65));
  return Math.random() * 100 < missChance;
}

function goalkeeperSaveChance(power, accuracy) {
  const base = 34;
  const bonus = Math.max(0, 70 - power) * 0.18 + Math.max(0, 80 - accuracy) * 0.12;
  return base + bonus;
}

function cpuShotQuality() {
  return {
    power: 55 + Math.floor(Math.random() * 36),
    accuracy: 58 + Math.floor(Math.random() * 35)
  };
}

function registerPlayerShot(goal) {
  game.playerShots += 1;
  if (goal) game.playerScore += 1;
  game.playerResults.push(goal);
}

function registerCpuShot(goal) {
  game.cpuShots += 1;
  if (goal) game.cpuScore += 1;
  game.cpuResults.push(goal);
}

function playTurn(direction) {
  if (game.gameOver || game.busy) return;
  game.busy = true;

  const isPlayerKicking = game.phase === "player-kick" || game.phase === "sudden-player";

  if (isPlayerKicking) {
    const power = Number(powerInput.value);
    const accuracy = Number(accuracyInput.value);
    const keeperChoice = randomDirection();

    shotInfo.textContent = `Pateaste ${directionLabel(direction)}...`;
    animateBall(direction, power);

    setTimeout(() => {
      moveKeeper(keeperChoice);
    }, 120);

    setTimeout(() => {
      const wildMiss = shotMissesByPowerAndAccuracy(power, accuracy);
      let goal = false;

      if (wildMiss) {
        goal = false;
        messageEl.textContent = `😬 La tiraste afuera. Demasiada potencia o poca precisión.`;
      } else {
        const saveProbability = goalkeeperSaveChance(power, accuracy);
        const keeperSaves = direction === keeperChoice && Math.random() * 100 < saveProbability;
        goal = !keeperSaves;

        if (goal) {
          messageEl.textContent = `⚽ ¡Gol de ${game.playerTeam.name}! Pateaste ${directionLabel(direction)} con ${power} de potencia.`;
        } else {
          messageEl.textContent = `🧤 ¡Atajó ${game.cpuTeam.name}! El arquero fue ${directionLabel(keeperChoice)}.`;
        }
      }

      registerPlayerShot(goal);
      updateUI();

      setTimeout(() => {
        resetField();
        goNextPhase();
        game.busy = false;
      }, 750);
    }, 720);
  } else {
    const cpuShot = cpuShotQuality();
    const cpuDirection = randomDirection();

    shotInfo.textContent = `Te tiraste ${directionLabel(direction)}...`;
    animateBall(cpuDirection, cpuShot.power);

    setTimeout(() => {
      moveKeeper(direction, true);
    }, 120);

    setTimeout(() => {
      const cpuWildMiss = shotMissesByPowerAndAccuracy(cpuShot.power, cpuShot.accuracy);
      let goal = false;

      if (cpuWildMiss) {
        goal = false;
        messageEl.textContent = `😮 ${game.cpuTeam.name} la tiró afuera.`;
      } else {
        const yourSaveChance = goalkeeperSaveChance(cpuShot.power, cpuShot.accuracy);
        const youSave = direction === cpuDirection && Math.random() * 100 < yourSaveChance;
        goal = !youSave;

        if (goal) {
          messageEl.textContent = `😬 Gol de ${game.cpuTeam.name}. Pateó ${directionLabel(cpuDirection)}.`;
        } else {
          messageEl.textContent = `🧤 ¡Atajada tuya! Tapaste el penal de ${game.cpuTeam.name}.`;
        }
      }

      registerCpuShot(goal);
      updateUI();

      setTimeout(() => {
        resetField();
        goNextPhase();
        game.busy = false;
      }, 750);
    }, 720);
  }
}

powerInput.addEventListener("input", updateMeterLabels);
accuracyInput.addEventListener("input", updateMeterLabels);
startBtn.addEventListener("click", resetGame);
restartBtn.addEventListener("click", resetGame);

fillTeams();
resetGame();
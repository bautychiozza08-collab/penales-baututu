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
const startMatchBtn = document.getElementById("startMatchBtn");
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
const messageEl = document.getElementById("message");
const shotInfo = document.getElementById("shotInfo");
const playerTrack = document.getElementById("playerTrack");
const cpuTrack = document.getElementById("cpuTrack");

const keeperEl = document.getElementById("keeper");
const ballEl = document.getElementById("ball");

const directions = ["izquierda", "centro", "derecha"];

let state = {};

function fillTeams() {
  teams.forEach((team, index) => {
    const option1 = document.createElement("option");
    option1.value = team.name;
    option1.textContent = `${team.flag} ${team.name}`;
    playerTeamSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = team.name;
    option2.textContent = `${team.flag} ${team.name}`;
    cpuTeamSelect.appendChild(option2);
  });

  playerTeamSelect.value = "Argentina";
  cpuTeamSelect.value = "Brasil";
}

function getTeamByName(name) {
  return teams.find(team => team.name === name);
}

function initState() {
  state = {
    playerTeam: getTeamByName(playerTeamSelect.value),
    cpuTeam: getTeamByName(cpuTeamSelect.value),
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

  if (state.playerTeam.name === state.cpuTeam.name) {
    const alt = teams.find(t => t.name !== state.playerTeam.name);
    state.cpuTeam = alt;
    cpuTeamSelect.value = alt.name;
  }

  updateUI();
  resetField();
  messageEl.textContent = "Arrancó la tanda. Primero pateás vos.";
  shotInfo.textContent = "Elegí dirección de tiro.";
}

function updateUI() {
  playerFlag.textContent = state.playerTeam.flag;
  cpuFlag.textContent = state.cpuTeam.flag;
  playerTeamName.textContent = state.playerTeam.name;
  cpuTeamName.textContent = state.cpuTeam.name;
  playerScoreEl.textContent = state.playerScore;
  cpuScoreEl.textContent = state.cpuScore;
  roundText.textContent = state.round;

  let turnLabel = "Tu disparo";
  if (state.phase === "cpu-kick") turnLabel = "Tu atajada";
  if (state.phase === "sudden-player") turnLabel = "Muerte súbita: tu disparo";
  if (state.phase === "sudden-cpu") turnLabel = "Muerte súbita: tu atajada";

  turnText.textContent = turnLabel;
  actionTitle.textContent = turnLabel;
  phaseText.textContent = state.round > 5 ? "Muerte súbita" : "Tanda de penales";
  stateText.textContent = state.gameOver ? "Finalizado" : "Jugando";

  renderTrackers();
}

function renderTrackers() {
  playerTrack.innerHTML = "";
  cpuTrack.innerHTML = "";

  state.playerResults.forEach(result => {
    const dot = document.createElement("div");
    dot.className = `track-dot ${result ? "goal" : "miss"}`;
    playerTrack.appendChild(dot);
  });

  state.cpuResults.forEach(result => {
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

function moveKeeper(direction) {
  if (direction === "izquierda") {
    keeperEl.style.left = "25%";
    keeperEl.style.transform = "translateX(-50%) rotate(-10deg)";
  } else if (direction === "centro") {
    keeperEl.style.left = "50%";
    keeperEl.style.transform = "translateX(-50%) scale(1.03)";
  } else {
    keeperEl.style.left = "75%";
    keeperEl.style.transform = "translateX(-50%) rotate(10deg)";
  }
}

function animateBall(direction, isKick) {
  let left = "50%";
  if (direction === "izquierda") left = "23%";
  if (direction === "centro") left = "50%";
  if (direction === "derecha") left = "77%";

  ballEl.style.left = left;
  ballEl.style.bottom = "175px";
  ballEl.style.transform = "translateX(-50%) scale(0.72)";
}

function directionLabel(direction) {
  if (direction === "izquierda") return "izquierda";
  if (direction === "centro") return "al centro";
  return "derecha";
}

function randomDirection() {
  return directions[Math.floor(Math.random() * directions.length)];
}

function evaluateEarlyEnd() {
  const playerRemaining = 5 - state.playerShots;
  const cpuRemaining = 5 - state.cpuShots;

  if (state.playerScore > state.cpuScore + cpuRemaining) return "player";
  if (state.cpuScore > state.playerScore + playerRemaining) return "cpu";
  return null;
}

function finishGame(winner) {
  state.gameOver = true;
  updateUI();

  if (winner === "player") {
    messageEl.textContent = `🏆 ¡Ganó ${state.playerTeam.name}! Le ganaste a ${state.cpuTeam.name} en la tanda.`;
  } else if (winner === "cpu") {
    messageEl.textContent = `😓 Ganó ${state.cpuTeam.name}. Probá otra vez y tomá revancha.`;
  } else {
    messageEl.textContent = "🤯 Sigue la igualdad. Esto no debería pasar.";
  }

  shotInfo.textContent = "Partido terminado.";
}

function nextPhase() {
  if (state.gameOver) return;

  if (state.round <= 5) {
    const earlyWinner = evaluateEarlyEnd();
    if (earlyWinner) {
      finishGame(earlyWinner);
      return;
    }
  }

  if (state.phase === "player-kick") {
    state.phase = "cpu-kick";
  } else if (state.phase === "cpu-kick") {
    if (state.round < 5) {
      state.round += 1;
      state.phase = "player-kick";
    } else {
      if (state.playerScore !== state.cpuScore) {
        finishGame(state.playerScore > state.cpuScore ? "player" : "cpu");
        return;
      }
      state.round += 1;
      state.phase = "sudden-player";
      messageEl.textContent = "🔥 Empieza la muerte súbita.";
    }
  } else if (state.phase === "sudden-player") {
    state.phase = "sudden-cpu";
  } else if (state.phase === "sudden-cpu") {
    const playerLast = state.playerResults[state.playerResults.length - 1];
    const cpuLast = state.cpuResults[state.cpuResults.length - 1];

    if (playerLast !== cpuLast) {
      finishGame(playerLast ? "player" : "cpu");
      return;
    }

    state.round += 1;
    state.phase = "sudden-player";
    messageEl.textContent = "🔥 Sigue la muerte súbita.";
  }

  updateUI();
  if (!state.gameOver) {
    shotInfo.textContent = state.phase === "player-kick" || state.phase === "sudden-player"
      ? "Elegí dirección de tiro."
      : "Elegí hacia dónde te tirás.";
  }
}

function registerPlayerShot(goal) {
  state.playerShots += 1;
  if (goal) state.playerScore += 1;
  state.playerResults.push(goal);
}

function registerCpuShot(goal) {
  state.cpuShots += 1;
  if (goal) state.cpuScore += 1;
  state.cpuResults.push(goal);
}

function playAction(direction) {
  if (state.gameOver || state.busy) return;

  state.busy = true;

  const isPlayerKicking = state.phase === "player-kick" || state.phase === "sudden-player";
  const cpuChoice = randomDirection();

  if (isPlayerKicking) {
    shotInfo.textContent = `Pateaste ${directionLabel(direction)}...`;
    animateBall(direction, true);

    setTimeout(() => {
      moveKeeper(cpuChoice);
    }, 120);

    setTimeout(() => {
      const goal = direction !== cpuChoice;
      registerPlayerShot(goal);

      if (goal) {
        messageEl.textContent = `⚽ ¡Gol de ${state.playerTeam.name}! El arquero fue ${directionLabel(cpuChoice)}.`;
      } else {
        messageEl.textContent = `🧤 ¡Atajó ${state.cpuTeam.name}! El arquero fue ${directionLabel(cpuChoice)}.`;
      }

      updateUI();
      setTimeout(() => {
        resetField();
        nextPhase();
        state.busy = false;
      }, 700);
    }, 700);
  } else {
    shotInfo.textContent = `Te tiraste ${directionLabel(direction)}...`;
    animateBall(cpuChoice, true);

    setTimeout(() => {
      moveKeeper(direction);
    }, 120);

    setTimeout(() => {
      const goal = cpuChoice !== direction;
      registerCpuShot(goal);

      if (goal) {
        messageEl.textContent = `😬 Gol de ${state.cpuTeam.name}. Pateó ${directionLabel(cpuChoice)}.`;
      } else {
        messageEl.textContent = `🧤 ¡Atajada tuya! Te tiraste ${directionLabel(direction)} y tapaste el penal.`;
      }

      updateUI();
      setTimeout(() => {
        resetField();
        nextPhase();
        state.busy = false;
      }, 700);
    }, 700);
  }
}

startMatchBtn.addEventListener("click", initState);
restartBtn.addEventListener("click", initState);

fillTeams();
initState();
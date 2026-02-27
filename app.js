const movements = {
  bench: {
    name: "Bench Press",
    category: "chest_press",
    suggestedWeight: 185,
    suggestedReps: 8,
    alternatives: ["Dumbbell Press", "Machine Chest Press"]
  },
  squat: {
    name: "Squat",
    category: "squat_pattern",
    suggestedWeight: 225,
    suggestedReps: 6,
    alternatives: ["Hack Squat", "Leg Press"]
  }
};

function renderMovements() {
  const container = document.getElementById("movementList");
  container.innerHTML = "";

  Object.keys(movements).forEach(key => {
    const m = movements[key];

    const div = document.createElement("div");
    div.className = "movement";

    div.innerHTML = `
      <div class="movement-title">${m.name}</div>
      <div>Suggested: ${m.suggestedReps} reps @ ${m.suggestedWeight} lbs</div>

      <div class="movement-controls">
        <input type="number" placeholder="Weight" id="${key}_weight">
        <input type="number" placeholder="Reps" id="${key}_reps">
        <button onclick="logSet('${key}')">Log</button>
        <button onclick="swapExercise('${key}')">Sub</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function logSet(key) {
  const weight = parseInt(document.getElementById(`${key}_weight`).value);
  const reps = parseInt(document.getElementById(`${key}_reps`).value);

  if (!weight || !reps) return;

  const m = movements[key];

  if (reps >= m.suggestedReps) {
    m.suggestedWeight += 5;
  }

  document.getElementById(`${key}_weight`).value = "";
  document.getElementById(`${key}_reps`).value = "";

  renderMovements();
}

function swapExercise(key) {
  const m = movements[key];
  const alt = m.alternatives[0];
  alert("Substitute with: " + alt);
}

let timerInterval = null;
let repeatAlarm = null;

function playAlarm() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 880;
  gain.gain.value = 0.7;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
  if (navigator.vibrate) navigator.vibrate([300,150,300]);
}

function showOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "alarm-overlay";
  overlay.innerHTML = `
    <div>TIME IS UP</div>
    <button onclick="dismissAlarm()">DISMISS</button>
  `;
  overlay.onclick = dismissAlarm;
  document.body.appendChild(overlay);
}

function dismissAlarm() {
  clearInterval(repeatAlarm);
  const overlay = document.querySelector(".alarm-overlay");
  if (overlay) overlay.remove();
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  clearInterval(repeatAlarm);

  let remaining = seconds;
  document.getElementById("timerDisplay").innerText = remaining;

  timerInterval = setInterval(() => {
    remaining--;
    document.getElementById("timerDisplay").innerText = remaining;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      showOverlay();
      playAlarm();
      repeatAlarm = setInterval(playAlarm, 2000);
    }
  }, 1000);
}

renderMovements();

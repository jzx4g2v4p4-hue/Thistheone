
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

function runAudit() {
  const rival = document.getElementById("rivalToggle").checked;
  let missed = [];

  if (!vyvanse.checked) missed.push("Vyvanse");
  if (!wellbutrin.checked) missed.push("Wellbutrin");
  if (!sertraline.checked) missed.push("Sertraline");

  if (missed.length === 0) {
    auditOutput.innerText = "Clean execution. No misses.";
  } else {
    auditOutput.innerText = rival
      ? "Missed: " + missed.join(", ") + " — This is where standards slip."
      : "Missed: " + missed.join(", ");
  }
}

// Contadores e controle de estado
let cycleCount = 0;                  // Contador de ciclos de foco
const maxCycles = 4;                 // Quantos ciclos antes da pausa longa
let currentMode = null;              // Modo atual
let timer = null;                    // Referência ao intervalo
let timeLeft = 0;                    // Tempo restante em segundos
let running = false;                 // Timer está ativo?

// Configurações dos modos
const modes = {
  focus:      { bg: '#ffeaea', label: 'Foco' },
  shortBreak: { bg: '#eaffea', label: 'Pausa Curta' },
  longBreak:  { bg: '#eaf3ff', label: 'Pausa Longa' }
};

// Inicia o modo escolhido
function startMode(mode) {
  currentMode = mode;
  document.body.style.background = modes[mode].bg;
  document.getElementById('mode-title').textContent = `Modo: ${modes[mode].label}`;

  // Lê o tempo definido pelo usuário
  let inputMinutes = 25;
  if (mode === 'focus') inputMinutes = parseInt(document.getElementById('focus-time').value);
  if (mode === 'shortBreak') inputMinutes = parseInt(document.getElementById('short-time').value);
  if (mode === 'longBreak') inputMinutes = parseInt(document.getElementById('long-time').value);

  timeLeft = inputMinutes * 60;
  updateTimerDisplay();
  updateCycleInfo();
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('timer-screen').classList.remove('hidden');
}

// Atualiza o tempo no display
function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

// Mostra quantos ciclos já foram feitos
function updateCycleInfo() {
  document.getElementById('cycle-info').textContent = `Ciclo: ${cycleCount} / ${maxCycles}`;
}

// Inicia ou pausa o cronômetro
function toggleTimer() {
  if (running) {
    clearInterval(timer);
    running = false;
  } else {
    running = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        notifyAndSwitchMode(); // chama próximo ciclo
      }
    }, 1000);
  }
}

// Lógica para troca automática de modos e notificação
function notifyAndSwitchMode() {
  // Notificação do navegador
  if (Notification.permission === "granted") {
    new Notification("⏰ Tempo Finalizado", {
      body: currentMode === 'focus' ? 'Hora da pausa!' : 'Hora de voltar ao foco!'
    });
  }

  // Alternância entre modos
  if (currentMode === 'focus') {
    cycleCount++;
    if (cycleCount >= maxCycles) {
      cycleCount = 0;
      startMode('longBreak');
    } else {
      startMode('shortBreak');
    }
  } else {
    startMode('focus');
  }
}

// Reseta o timer sem sair da tela
function resetTimer() {
  clearInterval(timer);
  updateTimerDisplay();
  running = false;
}

// Pula o tempo atual e volta à tela inicial
function skipTimer() {
  clearInterval(timer);
  alert("⏭️ Tempo pulado!");
  goHome();
}

// Volta à tela inicial
function goHome() {
  document.getElementById('timer-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
  running = false;
}

// Solicita permissão para notificações ao abrir
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

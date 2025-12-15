// --- CONFIG & DATA ---
const DATA = {
    "Food": ["Pizza", "Sushi", "Tacos", "Burger", "Pasta", "Ice Cream", "Steak", "Salad"],
    "Animals": ["Lion", "Penguin", "Shark", "Eagle", "Elephant", "Giraffe", "Panda", "Snake"],
    "Jobs": ["Doctor", "Teacher", "Pilot", "Chef", "Firefighter", "Artist", "Clown", "Spy"],
    "Locations": ["School", "Hospital", "Beach", "Space Station", "Prison", "Library", "Casino", "Zoo"],
    "Objects": ["Chair", "Toaster", "Phone", "Shoe", "Umbrella", "Mirror", "Fork", "Laptop"]
};

// --- STATE ---
let state = {
    step: 'LOBBY', // LOBBY, PREP, GAME, REVEAL
    players: [], // Array of names
    topic: null,
    secretWord: null,
    imposterIndex: null,
    startTime: null
};

// Check if we are a Player (Phone) or Host (TV)
const params = new URLSearchParams(window.location.search);
const isPlayerMode = params.has('data');

// --- APP INIT ---
const app = document.getElementById('app');

if (isPlayerMode) {
    renderPlayerScreen();
} else {
    // Load local storage if available
    const saved = localStorage.getItem('imposterState');
    if (saved) state = JSON.parse(saved);
    renderHostScreen();
}

// --- CORE FUNCTIONS ---

function addPlayer() {
    const input = document.getElementById('nameInput');
    const name = input.value.trim().toUpperCase();
    if (!name) return;
    if (state.players.includes(name)) return alert("Name taken!");
    
    state.players.push(name);
    input.value = '';
    saveState();
    renderHostScreen();
}

function removePlayer(index) {
    state.players.splice(index, 1);
    saveState();
    renderHostScreen();
}

function startGame(selectedTopic) {
    if (state.players.length < 3) return alert("Need 3+ players!");
    
    state.topic = selectedTopic;
    const words = DATA[selectedTopic];
    state.secretWord = words[Math.floor(Math.random() * words.length)];
    state.imposterIndex = Math.floor(Math.random() * state.players.length);
    state.step = 'PREP';
    state.startTime = null; // Reset timer
    
    saveState();
    renderHostScreen();
}

function startRound() {
    state.step = 'GAME';
    state.startTime = Date.now();
    saveState();
    renderHostScreen();
}

function revealGame() {
    state.step = 'REVEAL';
    saveState();
    renderHostScreen();
}

function resetGame() {
    state.step = 'LOBBY';
    state.topic = null;
    state.secretWord = null;
    state.imposterIndex = null;
    saveState();
    renderHostScreen();
}

function saveState() {
    localStorage.setItem('imposterState', JSON.stringify(state));
}

// --- RENDERERS (HOST) ---

function renderHostScreen() {
    if (state.step === 'LOBBY') renderLobby();
    else if (state.step === 'PREP') renderPrep();
    else if (state.step === 'GAME') renderGame();
    else if (state.step === 'REVEAL') renderReveal();
}

function renderLobby() {
    app.innerHTML = `
        <h1>THE IMPOSTER</h1>
        <p>A Game of Deception</p>
        
        <div class="grid-names">
            ${state.players.map((p, i) => `<div class="name-chip" onclick="removePlayer(${i})">${p} ✕</div>`).join('')}
        </div>

        <div style="max-width: 400px; margin: 0 auto;">
            <input type="text" id="nameInput" placeholder="ENTER NAME" onkeydown="if(event.key==='Enter') addPlayer()">
            <button class="btn" onclick="addPlayer()">Add Player</button>
        </div>

        ${state.players.length >= 3 ? `
            <h2 style="margin-top:40px;">Select Topic</h2>
            <div class="card-grid">
                ${Object.keys(DATA).map(t => `<div class="card" onclick="startGame('${t}')">${t}</div>`).join('')}
            </div>
        ` : '<p style="margin-top:20px; opacity:0.5;">Add at least 3 players to start</p>'}
    `;
}

function renderPrep() {
    app.innerHTML = `
        <h1>DISTRIBUTE ROLES</h1>
        <p>Topic: <span class="highlight">${state.topic}</span></p>
        <p>Call players up to scan their code, or pass the device around.</p>
        
        <div class="card-grid">
            ${state.players.map((p, i) => `
                <div class="card" onclick="showPlayerQR(${i})">
                    <div style="font-size:2rem;">📱</div>
                    <div>${p}</div>
                </div>
            `).join('')}
        </div>

        <button class="btn" style="margin-top:30px;" onclick="startRound()">Everyone is Ready > Start Timer</button>
        <button class="btn btn-outline" onclick="resetGame()">Back</button>
    `;
}

function renderGame() {
    app.innerHTML = `
        <h1>GAME IN PROGRESS</h1>
        <p>Topic: <span class="highlight">${state.topic}</span></p>
        
        <div id="timer" style="font-size: 5rem; font-weight: bold; font-variant-numeric: tabular-nums; margin: 20px 0;">0:00</div>
        
        <p>Go around the circle. Say <strong>ONE WORD</strong> related to the secret.</p>
        <p>Find the Imposter.</p>

        <button class="btn btn-danger" onclick="revealGame()">STOP & VOTE</button>
    `;
    
    // Simple Timer Logic
    const timerEl = document.getElementById('timer');
    const updateTimer = () => {
        if (state.step !== 'GAME') return;
        const diff = Math.floor((Date.now() - state.startTime) / 1000);
        const m = Math.floor(diff / 60);
        const s = (diff % 60).toString().padStart(2, '0');
        timerEl.innerText = `${m}:${s}`;
        requestAnimationFrame(updateTimer);
    };
    updateTimer();
}

function renderReveal() {
    const imposterName = state.players[state.imposterIndex];
    
    app.innerHTML = `
        <h1>TIME'S UP</h1>
        <h2>The Secret Word was:</h2>
        <h1 class="highlight" style="font-size: 4rem;">${state.secretWord}</h1>
        
        <div style="margin: 40px 0;">
            <h2>The Imposter was:</h2>
            <div class="name-chip" style="background:var(--secondary); font-size: 2rem;">${imposterName}</div>
        </div>

        <button class="btn" onclick="resetGame()">Play Again</button>
    `;
    
    // Confetti
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

// --- RENDERERS (PLAYER PHONE) ---

function renderPlayerScreen() {
    try {
        const raw = atob(params.get('data'));
        const data = JSON.parse(raw);
        
        // Anti-cheat: Check if already viewed in this session? (Optional, skipping for simplicity)

        app.innerHTML = `
            <h2>Hello, ${data.name}</h2>
            <p>Topic: <strong>${data.topic}</strong></p>
            <p style="margin-top:40px;">Tap & Hold to view your role</p>
            
            <div class="secret-box" id="secretBox">
                <div class="secret-content">???</div>
                <div class="tap-hint">HOLD TO REVEAL</div>
            </div>

            <p style="font-size:0.9rem; opacity:0.6; margin-top:20px;">
                Don't show this screen to anyone else!
            </p>
        `;

        const box = document.getElementById('secretBox');
        const content = box.querySelector('.secret-content');
        const hint = box.querySelector('.tap-hint');

        const reveal = () => {
            if (data.role === 'IMPOSTER') {
                content.innerText = "YOU ARE THE IMPOSTER";
                content.style.color = "var(--secondary)";
                content.style.fontSize = "1.5rem";
                hint.innerText = "Blend in. Guess the word.";
            } else {
                content.innerText = data.word;
                content.style.color = "var(--primary)";
                hint.innerText = "This is the secret.";
            }
            content.style.filter = "blur(0)";
        };

        const hide = () => {
            content.style.filter = "blur(20px)";
        };

        box.addEventListener('mousedown', reveal);
        box.addEventListener('mouseup', hide);
        box.addEventListener('touchstart', (e) => { e.preventDefault(); reveal(); });
        box.addEventListener('touchend', hide);

    } catch (e) {
        app.innerHTML = `<h2>Error</h2><p>Invalid Game Data</p>`;
    }
}

// --- UTILS ---

function showPlayerQR(index) {
    const player = state.players[index];
    const isImposter = (index === state.imposterIndex);
    
    // Create Payload
    const payload = {
        name: player,
        topic: state.topic,
        role: isImposter ? 'IMPOSTER' : 'CITIZEN',
        word: isImposter ? null : state.secretWord
    };
    
    // Encode
    const json = JSON.stringify(payload);
    const b64 = btoa(json);
    const url = `${window.location.origin}${window.location.pathname}?data=${b64}`;
    
    // Show Modal
    const modal = document.getElementById('qrModal');
    const target = document.getElementById('qrTarget');
    const title = document.getElementById('qrTitle');
    
    target.innerHTML = '';
    title.innerText = `Scan for ${player}`;
    
    new QRCode(target, {
        text: url,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('qrModal').classList.remove('active');
}

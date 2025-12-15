// --- AUDIO SYSTEM (Taken from Line Up!) ---
const SFX = {
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'),
    scan: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-interface-robot-click-901.mp3'),
    reveal: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3'),
    alarm: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'),
    win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3')
};

function playSfx(key) {
    try {
        const s = SFX[key].cloneNode();
        s.volume = 0.5;
        s.play().catch(() => {});
    } catch(e) {}
}

function pulse(ms = 20) {
    if (navigator.vibrate) navigator.vibrate(ms);
}

async function requestWakeLock() {
    if ('wakeLock' in navigator) { try { await navigator.wakeLock.request('screen'); } catch (err) {} }
}

// --- DATA ---
const DEFAULT_TOPICS = {
    "Food": ["Pizza", "Sushi", "Tacos", "Burger", "Pasta", "Ice Cream", "Steak", "Salad", "Soup", "Curry"],
    "Animals": ["Lion", "Penguin", "Shark", "Eagle", "Elephant", "Giraffe", "Panda", "Snake", "Spider", "Frog"],
    "Jobs": ["Doctor", "Teacher", "Pilot", "Chef", "Firefighter", "Artist", "Clown", "Spy", "Coder", "Lawyer"],
    "Places": ["School", "Hospital", "Beach", "Space Station", "Prison", "Library", "Casino", "Zoo", "Mars", "Gym"],
    "Household": ["Chair", "Toaster", "Phone", "Shoe", "Umbrella", "Mirror", "Fork", "Laptop", "Bed", "Lamp"]
};

// --- STATE ---
let state = {
    step: 'LOBBY', 
    players: [],
    passMode: false, // NEW: Pass & Play toggle
    passIndex: 0,    // NEW: Who is holding the phone?
    topic: null,
    secretWord: null,
    imposterIndex: null,
    startTime: null,
    customWords: [] // NEW: Custom input
};

// Detect Mode
const params = new URLSearchParams(window.location.search);
const isPlayerMode = params.has('data');
const app = document.getElementById('app');

// --- INIT ---
if (isPlayerMode) {
    renderPlayerScreen();
} else {
    // Load local storage
    const saved = localStorage.getItem('imposterState');
    if (saved) state = { ...state, ...JSON.parse(saved) };
    if(state.step !== 'LOBBY') renderHostScreen(); // Restore state
    else renderLobby();
}

// --- LOGIC ---

function addPlayer() {
    const input = document.getElementById('nameInput');
    const name = input.value.trim().toUpperCase();
    if (!name) return;
    if (state.players.includes(name)) return alert("Name taken!");
    
    playSfx('click');
    state.players.push(name);
    input.value = '';
    saveState();
    renderLobby();
    setTimeout(() => { document.getElementById('nameInput').focus(); }, 10);
}

function removePlayer(index) {
    state.players.splice(index, 1);
    saveState();
    renderLobby();
}

function togglePassMode() {
    state.passMode = !state.passMode;
    playSfx('click');
    renderLobby();
}

function startGame(topic) {
    if (state.players.length < 3) return alert("Need 3+ players!");
    playSfx('scan');

    // Handle Custom Topic
    if (topic === 'CUSTOM') {
        const input = prompt("Enter words separated by comma (e.g. Apple, Banana, Orange)");
        if (!input) return;
        state.customWords = input.split(',').map(w => w.trim());
        if (state.customWords.length < 2) return alert("Need more words!");
        topic = "Custom";
    }

    state.topic = topic;
    const wordList = topic === "Custom" ? state.customWords : DEFAULT_TOPICS[topic];
    state.secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    state.imposterIndex = Math.floor(Math.random() * state.players.length);
    state.startTime = null;

    if (state.passMode) {
        state.step = 'PASS_PREP';
        state.passIndex = 0;
    } else {
        state.step = 'QR_PREP';
    }
    
    saveState();
    renderHostScreen();
}

function nextPassPlayer() {
    state.passIndex++;
    if (state.passIndex >= state.players.length) {
        startRound();
    } else {
        playSfx('click');
        renderHostScreen();
    }
}

function startRound() {
    playSfx('alarm');
    state.step = 'GAME';
    state.startTime = Date.now();
    saveState();
    renderHostScreen();
    requestWakeLock();
}

function revealGame() {
    playSfx('win');
    state.step = 'REVEAL';
    saveState();
    renderHostScreen();
    if (typeof confetti === 'function') {
        confetti({ particleCount: 200, spread: 100, colors: ['#0f0', '#f0f', '#0ff'] });
    }
}

function resetGame() {
    playSfx('click');
    state.step = 'LOBBY';
    state.topic = null;
    state.secretWord = null;
    state.imposterIndex = null;
    saveState();
    renderLobby();
}

function saveState() {
    if(!isPlayerMode) localStorage.setItem('imposterState', JSON.stringify(state));
}

// --- RENDERERS ---

function renderHostScreen() {
    // Determine which screen to show
    switch(state.step) {
        case 'LOBBY': renderLobby(); break;
        case 'QR_PREP': renderQrPrep(); break;
        case 'PASS_PREP': renderPassPrep(); break;
        case 'GAME': renderGame(); break;
        case 'REVEAL': renderReveal(); break;
    }
}

function renderLobby() {
    app.innerHTML = `
        <h1>THE IMPOSTER</h1>
        <p>CYBERPUNK EDITION</p>

        <div class="input-group">
            <input type="text" id="nameInput" placeholder="ADD AGENT NAME" autocomplete="off" onkeydown="if(event.key==='Enter') addPlayer()">
            <button onclick="addPlayer()" style="background:none; border:none; color:var(--primary); font-size:1.5rem; cursor:pointer;">+</button>
        </div>
        
        <div class="grid-names">
            ${state.players.map((p, i) => `<div class="name-chip" onclick="removePlayer(${i})">${p}</div>`).join('')}
        </div>

        <div class="toggle-wrapper">
            <span>📱 QR MODE</span>
            <label class="switch">
                <input type="checkbox" ${state.passMode ? 'checked' : ''} onchange="togglePassMode()">
                <span class="slider"></span>
            </label>
            <span>🤝 PASS MODE</span>
        </div>

        ${state.players.length >= 3 ? `
            <div class="topic-grid">
                ${Object.keys(DEFAULT_TOPICS).map(t => `<div class="topic-card" onclick="startGame('${t}')">${t}</div>`).join('')}
                <div class="topic-card" style="border-color:var(--secondary); color:var(--secondary)" onclick="startGame('CUSTOM')">Custom...</div>
            </div>
        ` : '<p style="margin-top:30px; font-size:0.8rem;">RECRUIT 3 AGENTS TO START</p>'}
    `;
}

function renderQrPrep() {
    app.innerHTML = `
        <h2>Topic: ${state.topic}</h2>
        <p>SCAN YOUR IDENTITY</p>
        
        <div class="grid-names" style="gap:15px; margin-top:30px;">
            ${state.players.map((p, i) => `
                <button class="btn btn-secondary" onclick="showPlayerQR(${i})" style="width:auto; padding:15px 25px;">
                    📱 ${p}
                </button>
            `).join('')}
        </div>

        <button class="btn" style="margin-top:40px; border-color:var(--accent); color:var(--accent);" onclick="startRound()">START MISSION</button>
        <button class="btn btn-secondary" onclick="resetGame()" style="margin-top:10px;">ABORT</button>
    `;
}

function renderPassPrep() {
    const pName = state.players[state.passIndex];
    app.innerHTML = `
        <h2>PASS THE DEVICE</h2>
        <h1 style="color:var(--text); text-shadow:none; font-size:2rem; margin:30px 0;">Agent: <br><span style="color:var(--primary); font-size:3rem;">${pName}</span></h1>
        <p>Take the device. Verify identity.</p>
        <button class="btn" onclick="renderPassReveal()">I AM ${pName}</button>
    `;
}

// Sub-function for Pass & Play Reveal
function renderPassReveal() {
    const isImposter = (state.passIndex === state.imposterIndex);
    const word = isImposter ? "IMPOSTER" : state.secretWord;
    const roleClass = isImposter ? 'color:var(--secondary)' : 'color:var(--primary)';
    
    app.innerHTML = `
        <h2>IDENTITY CHECK</h2>
        <p>Tap and Hold to reveal</p>
        <div class="secret-box" id="passBox">
            <div class="fingerprint-icon">☝️</div>
            <div class="secret-content" style="${roleClass}">${isImposter ? "YOU ARE THE<br>IMPOSTER" : word}</div>
        </div>
        <button class="btn" id="nextBtn" style="opacity:0; pointer-events:none;" onclick="nextPassPlayer()">CONFIRM & CLEAR</button>
    `;
    
    bindRevealEvents('passBox', isImposter, () => {
        const btn = document.getElementById('nextBtn');
        btn.style.opacity = 1;
        btn.style.pointerEvents = 'all';
    });
}

function renderGame() {
    app.innerHTML = `
        <h2 style="color:var(--primary)">MISSION ACTIVE</h2>
        <p>Topic: <strong style="color:white">${state.topic}</strong></p>
        
        <div id="timer" style="font-size: 6rem; font-family:var(--font); color:var(--text); text-shadow: 0 0 20px var(--primary); margin: 30px 0;">0:00</div>
        
        <p>Interrogate. Find the glitch.</p>
        <button class="btn btn-danger" onclick="revealGame()">EMERGENCY MEETING</button>
    `;
    
    // Timer Loop
    const timerEl = document.getElementById('timer');
    const update = () => {
        if(state.step !== 'GAME') return;
        const diff = Math.floor((Date.now() - state.startTime) / 1000);
        const m = Math.floor(diff / 60);
        const s = (diff % 60).toString().padStart(2, '0');
        timerEl.innerText = `${m}:${s}`;
        requestAnimationFrame(update);
    };
    update();
}

function renderReveal() {
    const imposterName = state.players[state.imposterIndex];
    app.innerHTML = `
        <h1>MISSION REPORT</h1>
        <p>The Secret Code:</p>
        <h2 style="font-size:2.5rem; color:var(--primary); margin-bottom:10px;">${state.secretWord}</h2>
        
        <div style="border:1px solid var(--secondary); padding:20px; border-radius:10px; margin:20px 0; background:rgba(255,0,85,0.1);">
            <p style="color:var(--secondary); margin:0;">THE IMPOSTER WAS</p>
            <div style="font-size:2rem; font-weight:bold; color:white; margin-top:10px;">${imposterName}</div>
        </div>

        <button class="btn" onclick="resetGame()">NEW MISSION</button>
    `;
}

// --- PLAYER MOBILE VIEW ---
function renderPlayerScreen() {
    let data;
    try { data = JSON.parse(atob(params.get('data'))); } 
    catch(e) { app.innerHTML = "LINK ERROR"; return; }
    
    const isImposter = data.role === 'IMPOSTER';
    
    app.innerHTML = `
        <p>AGENT: <strong>${data.name}</strong></p>
        <div class="secret-box" id="mobileBox">
            <div class="fingerprint-icon">☝️</div>
            <div class="secret-content" style="${isImposter ? 'color:var(--secondary)' : 'color:var(--primary)'}">
                ${isImposter ? "YOU ARE THE<br>IMPOSTER" : data.word}
            </div>
        </div>
        <p style="font-size:0.8rem; margin-top:20px;">HOLD TO DECRYPT</p>
    `;
    
    bindRevealEvents('mobileBox', isImposter);
}

// --- UTILS ---
function bindRevealEvents(id, isImposter, onRevealCallback) {
    const box = document.getElementById(id);
    if(!box) return;
    
    const reveal = (e) => {
        if(e.cancelable) e.preventDefault();
        if(!box.classList.contains('revealing')) {
            playSfx('reveal');
            if(isImposter) pulse([100, 50, 100]); // Double pulse for imposter
            else pulse(20);
        }
        box.classList.add('revealing');
        if(onRevealCallback) onRevealCallback();
    };
    
    const hide = (e) => {
        if(e.cancelable) e.preventDefault();
        box.classList.remove('revealing');
    };

    ['touchstart', 'mousedown'].forEach(evt => box.addEventListener(evt, reveal, {passive:false}));
    ['touchend', 'mouseup', 'mouseleave'].forEach(evt => box.addEventListener(evt, hide));
}

function showPlayerQR(index) {
    playSfx('click');
    const player = state.players[index];
    const isImposter = (index === state.imposterIndex);
    
    const payload = {
        name: player,
        topic: state.topic,
        role: isImposter ? 'IMPOSTER' : 'CITIZEN',
        word: isImposter ? null : state.secretWord
    };
    
    const url = `${window.location.origin}${window.location.pathname}?data=${btoa(JSON.stringify(payload))}`;
    
    const modal = document.getElementById('qrModal');
    const target = document.getElementById('qrTarget');
    target.innerHTML = '';
    
    new QRCode(target, {
        text: url,
        width: 250,
        height: 250,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.L
    });
    
    modal.classList.add('active');
}

function closeModal() {
    playSfx('click');
    document.getElementById('qrModal').classList.remove('active');
}

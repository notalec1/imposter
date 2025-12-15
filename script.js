// --- AUDIO SYSTEM ---
const SFX = {
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'),
    scan: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-interface-robot-click-901.mp3'),
    reveal: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3'),
    alarm: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3'),
    win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
    lose: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-470.mp3')
};

function playSfx(key) { try { const s = SFX[key].cloneNode(); s.volume = 0.5; s.play().catch(()=>{}); } catch(e){} }
function pulse(ms = 20) { if (navigator.vibrate) navigator.vibrate(ms); }
async function requestWakeLock() { if ('wakeLock' in navigator) { try { await navigator.wakeLock.request('screen'); } catch (err) {} } }

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
    passMode: false,
    passIndex: 0,
    topic: null,
    secretWord: null,
    imposterIndex: null,
    startTime: null,
    customWords: [],
    votedIndex: null // NEW: Tracks who the group voted for
};

const params = new URLSearchParams(window.location.search);
const isPlayerMode = params.has('data'); // Single Player Link
const isRoomMode = params.has('room');   // Room List Link
const app = document.getElementById('app');

// --- INIT ---
if (isPlayerMode) {
    renderPlayerScreen();
} else if (isRoomMode) {
    renderRoomSelection();
} else {
    const saved = localStorage.getItem('imposterState');
    if (saved) state = { ...state, ...JSON.parse(saved) };
    if(state.step !== 'LOBBY') renderHostScreen();
    else renderLobby();
}

// --- HOST LOGIC ---

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
    state.votedIndex = null;

    if (state.passMode) {
        state.step = 'PASS_PREP';
        state.passIndex = 0;
    } else {
        state.step = 'QR_PREP';
    }
    
    saveState();
    renderHostScreen();
}

function startRound() {
    playSfx('alarm');
    state.step = 'GAME';
    state.startTime = Date.now();
    saveState();
    renderHostScreen();
    requestWakeLock();
}

function startVoting() {
    playSfx('alarm');
    state.step = 'VOTING';
    saveState();
    renderHostScreen();
}

function selectVote(index) {
    playSfx('click');
    state.votedIndex = (state.votedIndex === index) ? null : index; // Toggle
    renderHostScreen();
}

function submitVote() {
    if (state.votedIndex === null) return alert("Select the suspect first!");
    playSfx('reveal');
    state.step = 'RESULTS';
    saveState();
    renderHostScreen();
    
    // Check win condition
    const imposterCaught = (state.votedIndex === state.imposterIndex);
    if(imposterCaught) {
         setTimeout(() => { playSfx('win'); confetti({ particleCount: 200, colors: ['#0f0', '#fff'] }); }, 500);
    } else {
         setTimeout(() => { playSfx('lose'); }, 500);
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
    if(!isPlayerMode && !isRoomMode) localStorage.setItem('imposterState', JSON.stringify(state));
}

// --- HOST RENDERERS ---

function renderHostScreen() {
    switch(state.step) {
        case 'LOBBY': renderLobby(); break;
        case 'QR_PREP': renderQrPrep(); break;
        case 'PASS_PREP': renderPassPrep(); break;
        case 'GAME': renderGame(); break;
        case 'VOTING': renderVoting(); break; // NEW
        case 'RESULTS': renderResults(); break; // NEW
    }
}

function renderLobby() {
    app.innerHTML = `
        <h1>THE IMPOSTER</h1>
        <p>CYBERPUNK EDITION</p>
        <div class="input-group">
            <input type="text" id="nameInput" placeholder="ADD AGENT NAME" autocomplete="off" onkeydown="if(event.key==='Enter') addPlayer()">
            <button onclick="addPlayer()" style="background:none; border:none; color:var(--primary); font-size:1.5rem;">+</button>
        </div>
        <div class="grid-names">
            ${state.players.map((p, i) => `<div class="name-chip" onclick="removePlayer(${i})">${p}</div>`).join('')}
        </div>
        <div class="toggle-wrapper">
            <span>📱 QR MODE</span>
            <label class="switch"><input type="checkbox" ${state.passMode ? 'checked' : ''} onchange="togglePassMode()"><span class="slider"></span></label>
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
        <div class="grid-names" style="gap:15px; margin-top:30px;">
            <button class="btn" style="border-color:var(--accent); color:var(--accent); padding:25px;" onclick="showRoomQR()">
                🏠 SHOW ROOM QR <br><span style="font-size:0.8rem">(Scan once for everyone)</span>
            </button>
        </div>
        <p style="margin:20px 0;">-- OR INDIVIDUAL --</p>
        <div class="grid-names">
            ${state.players.map((p, i) => `<button class="btn btn-secondary" onclick="showPlayerQR(${i})" style="width:auto; padding:10px;">📱 ${p}</button>`).join('')}
        </div>
        <button class="btn" style="margin-top:30px;" onclick="startRound()">START MISSION</button>
        <button class="btn btn-secondary" onclick="resetGame()" style="margin-top:10px;">ABORT</button>
    `;
}

function renderGame() {
    app.innerHTML = `
        <h2 style="color:var(--primary)">MISSION ACTIVE</h2>
        <p>Topic: <strong style="color:white">${state.topic}</strong></p>
        <div id="timer" style="font-size: 6rem; font-family:var(--font); color:var(--text); text-shadow: 0 0 20px var(--primary); margin: 30px 0;">0:00</div>
        <p>Interrogate. Find the glitch.</p>
        <button class="btn btn-danger" onclick="startVoting()">EMERGENCY MEETING / VOTE</button>
    `;
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

// --- NEW: VOTING SCREEN ---
function renderVoting() {
    app.innerHTML = `
        <h1 style="color:var(--secondary); animation:pulse-red 2s infinite;">VOTING PHASE</h1>
        <p>Who is the Imposter?</p>
        
        <div class="voting-grid">
            ${state.players.map((p, i) => `
                <div class="vote-card ${state.votedIndex === i ? 'selected' : ''}" onclick="selectVote(${i})">
                    <div style="font-size:2rem; margin-bottom:10px;">👤</div>
                    <div style="font-weight:bold;">${p}</div>
                </div>
            `).join('')}
        </div>

        <button class="btn btn-danger" onclick="submitVote()">EXECUTE SELECTED</button>
    `;
}

// --- NEW: RESULTS SCREEN ---
function renderResults() {
    const imposterName = state.players[state.imposterIndex];
    const votedName = state.votedIndex !== null ? state.players[state.votedIndex] : "Nobody";
    const imposterCaught = (state.votedIndex === state.imposterIndex);

    const bannerClass = imposterCaught ? "win-citizen" : "win-imposter";
    const resultTitle = imposterCaught ? "CITIZENS WIN" : "IMPOSTER WINS";
    const resultDesc = imposterCaught ? "The glitch was neutralized." : "The glitch escaped detection.";

    app.innerHTML = `
        <div class="result-banner ${bannerClass}">
            <h1 style="font-size:2.5rem; text-shadow:none; color:inherit;">${resultTitle}</h1>
            <p style="color:inherit; margin:0;">${resultDesc}</p>
        </div>

        <div style="display:flex; gap:10px; text-align:left;">
            <div style="flex:1; background:#111; padding:15px; border:1px solid #333;">
                <small>SECRET WORD</small><br>
                <strong style="color:var(--primary); font-size:1.5rem;">${state.secretWord}</strong>
            </div>
            <div style="flex:1; background:#111; padding:15px; border:1px solid #333;">
                <small>REAL IMPOSTER</small><br>
                <strong style="color:var(--secondary); font-size:1.5rem;">${imposterName}</strong>
            </div>
        </div>

        <p style="margin-top:20px;">You voted for: <strong>${votedName}</strong></p>

        <button class="btn" onclick="resetGame()">NEW MISSION</button>
    `;
}

// --- ROOM MODE RENDERER (Player's Phone) ---

function renderRoomSelection() {
    let roomData;
    try { roomData = JSON.parse(atob(params.get('room'))); } 
    catch(e) { app.innerHTML = "ROOM ERROR"; return; }

    const mySavedName = localStorage.getItem('imposter_identity_' + roomData.id);

    // If already claimed, skip selection
    if (mySavedName) {
        const p = roomData.players.find(x => x.name === mySavedName);
        if (p) {
            renderPlayerIdentity(p.name, p.role, p.word, roomData.topic);
            return;
        }
    }

    app.innerHTML = `
        <h2>SELECT IDENTITY</h2>
        <p>Who are you?</p>
        <div class="room-list">
            ${roomData.players.map(p => `
                <button class="room-btn" onclick="claimIdentity('${p.name}', '${p.role}', '${p.word}', '${roomData.topic}', '${roomData.id}')">
                    <strong>${p.name}</strong>
                    <span>👉</span>
                </button>
            `).join('')}
        </div>
    `;
}

function claimIdentity(name, role, word, topic, roomId) {
    if(confirm(`Are you definitely ${name}?`)) {
        localStorage.setItem('imposter_identity_' + roomId, name);
        renderPlayerIdentity(name, role, word, topic);
    }
}

function renderPlayerIdentity(name, role, word, topic) {
    const isImposter = (role === 'IMPOSTER');
    
    // Add "Vote" button for mobile that just toggles a visual guide
    app.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:20px;">
            <span>AGENT: <strong>${name}</strong></span>
            <span style="font-size:0.8rem; opacity:0.7;">${topic}</span>
        </div>

        <div class="secret-box" id="mobileBox">
            <div class="fingerprint-icon">☝️</div>
            <div class="secret-content" style="${isImposter ? 'color:var(--secondary)' : 'color:var(--primary)'}">
                ${isImposter ? "YOU ARE THE<br>IMPOSTER" : word}
            </div>
        </div>
        <p style="font-size:0.8rem; margin-top:20px;">HOLD TO DECRYPT</p>
        
        <div style="margin-top:50px; border-top:1px solid #333; padding-top:20px;">
            <p style="font-size:0.8rem; margin-bottom:5px;">TOOLS</p>
            <button class="btn btn-secondary" onclick="this.style.background='var(--secondary)'; this.innerText='VOTING...';">🗳️ OPEN VOTING GUIDE</button>
        </div>
    `;
    
    // Fix: Pass 'word' correctly. If imposter, word is null or undefined in payload usually, 
    // but render logic handles content display.
    bindRevealEvents('mobileBox', isImposter);
}

// --- STANDARD PLAYER RENDERER (Single QR) ---
function renderPlayerScreen() {
    let data;
    try { data = JSON.parse(atob(params.get('data'))); } 
    catch(e) { app.innerHTML = "LINK ERROR"; return; }
    renderPlayerIdentity(data.name, data.role, data.word, data.topic);
}

// --- UTILS ---

function bindRevealEvents(id, isImposter, cb) {
    const box = document.getElementById(id);
    if(!box) return;
    const reveal = (e) => {
        if(e.cancelable) e.preventDefault();
        if(!box.classList.contains('revealing')) {
            playSfx('reveal');
            if(isImposter) pulse([100, 50, 100]); else pulse(20);
        }
        box.classList.add('revealing');
        if(cb) cb();
    };
    const hide = (e) => { if(e.cancelable) e.preventDefault(); box.classList.remove('revealing'); };
    ['touchstart', 'mousedown'].forEach(evt => box.addEventListener(evt, reveal, {passive:false}));
    ['touchend', 'mouseup', 'mouseleave'].forEach(evt => box.addEventListener(evt, hide));
}

// Single QR for specific player
function showPlayerQR(index) {
    playSfx('click');
    const player = state.players[index];
    const isImposter = (index === state.imposterIndex);
    const payload = { name: player, topic: state.topic, role: isImposter ? 'IMPOSTER' : 'CITIZEN', word: isImposter ? null : state.secretWord };
    generateQR(payload, `Scan for ${player}`, 'data');
}

// Room QR for everyone
function showRoomQR() {
    playSfx('click');
    const roomId = Date.now().toString();
    const roomPayload = {
        id: roomId,
        topic: state.topic,
        players: state.players.map((p, i) => ({
            name: p,
            role: (i === state.imposterIndex) ? 'IMPOSTER' : 'CITIZEN',
            word: (i === state.imposterIndex) ? null : state.secretWord
        }))
    };
    generateQR(roomPayload, "Scan to Join Room", 'room');
}

function generateQR(payload, titleText, paramName) {
    const url = `${window.location.origin}${window.location.pathname}?${paramName}=${btoa(JSON.stringify(payload))}`;
    const modal = document.getElementById('qrModal');
    const target = document.getElementById('qrTarget');
    const title = modal.querySelector('h2');
    
    target.innerHTML = '';
    title.innerText = titleText;
    
    new QRCode(target, { text: url, width: 250, height: 250, colorDark : "#000000", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.L });
    modal.classList.add('active');
}

function closeModal() {
    playSfx('click');
    document.getElementById('qrModal').classList.remove('active');
}

// Pass Prep & Pass Reveal (Legacy support)
function renderPassPrep() {
    const pName = state.players[state.passIndex];
    app.innerHTML = `<h2>PASS THE DEVICE</h2><h1 style="color:var(--text); font-size:2rem; margin:30px 0;">Agent: <br><span style="color:var(--primary); font-size:3rem;">${pName}</span></h1><button class="btn" onclick="renderPassReveal()">I AM ${pName}</button>`;
}
function renderPassReveal() {
    const isImposter = (state.passIndex === state.imposterIndex);
    const word = isImposter ? "IMPOSTER" : state.secretWord;
    const roleClass = isImposter ? 'color:var(--secondary)' : 'color:var(--primary)';
    app.innerHTML = `<h2>IDENTITY CHECK</h2><div class="secret-box" id="passBox"><div class="fingerprint-icon">☝️</div><div class="secret-content" style="${roleClass}">${isImposter ? "YOU ARE THE<br>IMPOSTER" : word}</div></div><button class="btn" id="nextBtn" style="opacity:0; pointer-events:none;" onclick="nextPassPlayer()">CONFIRM & CLEAR</button>`;
    bindRevealEvents('passBox', isImposter, () => { document.getElementById('nextBtn').style.opacity = 1; document.getElementById('nextBtn').style.pointerEvents = 'all'; });
}
function nextPassPlayer() {
    state.passIndex++;
    if (state.passIndex >= state.players.length) startRound(); else { playSfx('click'); renderHostScreen(); }
}

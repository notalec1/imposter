        // --- TWEAKABLE AI SETTINGS ---
        const AI_MAX_CHARGES = 4; // Change this number to limit questions per session

        // --- PRESET NAMES ---
        const PRESET_NAMES = [
            "ALEC", "ALAIN", "NADA", "HODA", "FADI", "NOA", "GIO", "NEO", "NOUNOU", "ASSAAD", 
            "CHRIS", "ELIOTT", "ZELFA", "ZARA", "ZACK", "NICK", "IMAD", "YOLLA", "ANTHONY", "BASSAM", "MIRNA"
        ];

        // --- MATRIX RAIN EFFECT ---
        const initMatrix = () => {
            const canvas = document.getElementById('matrixCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZã¢ã¤ã¦ã¨ãªã«ã­ã¯ã±ã³ãµã·ã¹ã»ã½ã¿ãããã';
            const fontSize = 12;
            const columns = canvas.width / fontSize;
            const drops = [];
            for(let x = 0; x < columns; x++) drops[x] = 1;

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary').trim();
                ctx.font = fontSize + 'px monospace';
                for(let i = 0; i < drops.length; i++) {
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
            };
            setInterval(draw, 33);
            window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
        };

        // --- EXPANDED GAME DATA ---
        const GAME_DATA = {
            "Food": [
                { w: "Pizza", h: "Cheesy / Round" }, { w: "Sushi", h: "Rice / Fish" }, { w: "Tacos", h: "Shell / Mexican" },
                { w: "Burger", h: "Bun / Beef" }, { w: "Pasta", h: "Italian / Noodle" }, { w: "Ice Cream", h: "Cold / Sweet" },
                { w: "Steak", h: "Meat / Grill" }, { w: "Salad", h: "Green / Leafy" }, { w: "Soup", h: "Liquid / Spoon" }, { w: "Curry", h: "Spicy / Sauce" },
                { w: "Popcorn", h: "Movie / Corn" }, { w: "Donut", h: "Round / Hole" }, { w: "Chocolate", h: "Sweet / Brown" }
            ],
            "Animals": [
                { w: "Lion", h: "King / Roar" }, { w: "Penguin", h: "Ice / Bird" }, { w: "Shark", h: "Ocean / Teeth" },
                { w: "Eagle", h: "Fly / USA" }, { w: "Elephant", h: "Trunk / Grey" }, { w: "Giraffe", h: "Tall / Neck" },
                { w: "Panda", h: "Bamboo / B&W" }, { w: "Snake", h: "Slither / Long" }, { w: "Spider", h: "8 Legs / Web" }, { w: "Frog", h: "Jump / Green" },
                { w: "Bat", h: "Cave / Night" }, { w: "Kangaroo", h: "Jump / Pouch" }, { w: "Octopus", h: "8 Arms / Sea" }
            ],
            "Jobs": [
                { w: "Doctor", h: "Hospital / Heal" }, { w: "Teacher", h: "School / Learn" }, { w: "Pilot", h: "Plane / Fly" },
                { w: "Chef", h: "Kitchen / Cook" }, { w: "Firefighter", h: "Fire / Hose" }, { w: "Artist", h: "Paint / Draw" },
                { w: "Clown", h: "Funny / Circus" }, { w: "Spy", h: "Secret / Bond" }, { w: "Coder", h: "Computer / Type" }, { w: "Lawyer", h: "Court / Suit" },
                { w: "Cop", h: "Badge / Law" }, { w: "Farmer", h: "Crops / Animals" }, { w: "Astronaut", h: "Space / Suit" }
            ],
            "Places": [
                { w: "School", h: "Study / Class" }, { w: "Hospital", h: "Doctors / Sick" }, { w: "Beach", h: "Sand / Ocean" },
                { w: "Space Station", h: "Orbit / Stars" }, { w: "Prison", h: "Jail / Bars" }, { w: "Library", h: "Quiet / Books" },
                { w: "Casino", h: "Gambling / Chips" }, { w: "Zoo", h: "Animals / Cages" }, { w: "Mars", h: "Red Planet" }, { w: "Gym", h: "Workout / Sweat" },
                { w: "Cinema", h: "Movies / Corn" }, { w: "Museum", h: "Old / Art" }, { w: "Graveyard", h: "Dead / Spooky" }
            ],
            "Household": [
                { w: "Chair", h: "Sit / Legs" }, { w: "Toaster", h: "Bread / Hot" }, { w: "Phone", h: "Call / Screen" },
                { w: "Shoe", h: "Foot / Walk" }, { w: "Umbrella", h: "Rain / Dry" }, { w: "Mirror", h: "Reflect / Glass" },
                { w: "Fork", h: "Eat / Prongs" }, { w: "Laptop", h: "Computer / Fold" }, { w: "Bed", h: "Sleep / Soft" }, { w: "Lamp", h: "Light / Switch" },
                { w: "Toilet", h: "Flush / Bathroom" }, { w: "Fridge", h: "Cold / Food" }, { w: "Key", h: "Lock / Open" }
            ],
            "Vehicles": [
                { w: "Car", h: "Drive / Wheels" }, { w: "Bicycle", h: "Pedal / Two" }, { w: "Train", h: "Track / Choo" }, { w: "Boat", h: "Water / Float" },
                { w: "Helicopter", h: "Spin / Air" }, { w: "Tank", h: "War / Heavy" }, { w: "Submarine", h: "Underwater" }, { w: "Skateboard", h: "Tricks / Push" }
            ],
            "Sports": [
                { w: "Soccer", h: "Kick / Goal" }, { w: "Basketball", h: "Hoop / Bounce" }, { w: "Tennis", h: "Racket / Net" }, { w: "Golf", h: "Club / Hole" },
                { w: "Boxing", h: "Punch / Ring" }, { w: "Swimming", h: "Water / Pool" }, { w: "Baseball", h: "Bat / Base" }, { w: "Volleyball", h: "Beach / Spike" }
            ],
            "Nature": [
                { w: "Tree", h: "Leaves / Wood" }, { w: "Volcano", h: "Lava / Hot" }, { w: "Rain", h: "Water / Sky" }, { w: "Sun", h: "Hot / Star" },
                { w: "Moon", h: "Night / Space" }, { w: "Cloud", h: "White / Fluffy" }, { w: "Flower", h: "Rose / Smell" }, { w: "Mountain", h: "High / Climb" }
            ],
            "Electronics": [
                { w: "Camera", h: "Photo / Lens" }, { w: "Headphones", h: "Music / Ears" }, { w: "Drone", h: "Fly / Remote" }, { w: "Battery", h: "Power / Charge" },
                { w: "Keyboard", h: "Type / Keys" }, { w: "Mouse", h: "Click / Scroll" }, { w: "Robot", h: "Metal / AI" }, { w: "Tablet", h: "Touch / Screen" }
            ],
            "Clothes": [
                { w: "Hat", h: "Head / Cap" }, { w: "Jeans", h: "Pants / Denim" }, { w: "Shirt", h: "Torso / Wear" }, { w: "Socks", h: "Feet / Warm" },
                { w: "Glasses", h: "Eyes / See" }, { w: "Watch", h: "Wrist / Time" }, { w: "Coat", h: "Winter / Warm" }, { w: "Gloves", h: "Hands / Fingers" }
            ]
        };

        // --- AUDIO SYSTEM ---
        const SFX_URLS = {
            click: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3',
            scan: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-interface-robot-click-901.mp3',
            reveal: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3',
            alarm: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3',
            win: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            lose: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-470.mp3',
            roulette: 'https://assets.mixkit.co/sfx/preview/mixkit-tech-click-1140.mp3' 
        };

        function playSfx(key) { 
            try { 
                if(SFX_URLS[key]) {
                    const s = new Audio(SFX_URLS[key]);
                    s.volume = 0.5; 
                    s.play().catch(e => {}); 
                }
            } catch(e) {} 
        }

        function pulse(ms = 20) { if (navigator.vibrate) navigator.vibrate(ms); }
        async function requestWakeLock() { if ('wakeLock' in navigator) { try { await navigator.wakeLock.request('screen'); } catch (err) {} } }

        // --- STATE & CORE ---
        let state = {
            step: 'LOBBY', players: [], passMode: false, passIndex: 0,
            topic: null, secretWord: null, secretHint: null, 
            imposterIndices: [], glitchIndex: null,
            startTime: null, votedIndex: null, customWords: [],
            history: [], startingPlayer: null,
            settings: { timer: 180, imposterCount: 1, hasGlitch: false, timerMode: 'COUNTDOWN' }
        };

        const params = new URLSearchParams(window.location.search);
        const app = document.getElementById('app');

        // Safe Base64 Encoder/Decoder for Emojis/Unicode
        function safeBtoa(str) { return btoa(unescape(encodeURIComponent(str))); }
        function safeAtob(str) { return decodeURIComponent(escape(atob(str))); }

        // --- THEME LOGIC ---
        const THEMES = [null, 'netrunner', 'biohazard', 'ice']; 
        let currentThemeIndex = 0;

        function cycleTheme() {
            currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
            applyTheme();
            playSfx('click');
        }

        function applyTheme() {
            const theme = THEMES[currentThemeIndex];
            if (theme) document.body.setAttribute('data-theme', theme);
            else document.body.removeAttribute('data-theme');
            localStorage.setItem('imposterTheme', currentThemeIndex);
        }

        // --- AI LOGIC (FIXED) ---
        let aiParams = { role: null, word: null, topic: null };
        let aiChargesLeft = AI_MAX_CHARGES;

        function toggleAIChat() {
            const el = document.getElementById('ai-modal-overlay');
            if (el.style.display === 'flex') {
                el.style.display = 'none';
            } else {
                el.style.display = 'flex';
                updateAIContext(); // Refresh context when opening
                playSfx('scan');
            }
        }

        function updateAIContext() {
            // Reset charges if we detect a new game step, or maintain them
            // For this implementation, we reset charges when entering Lobby to give fresh charges per "session" or just visually update
            if(state.step === 'LOBBY') aiChargesLeft = AI_MAX_CHARGES; 
            
            // Determine context
            if (params.has('data')) {
                // Player View
                try {
                    let data = JSON.parse(safeAtob(params.get('data')));
                    aiParams = { role: data.role, word: data.word, topic: data.topic };
                } catch(e) {}
            } else if (state.step === 'GAME' || state.step === 'PASS_PREP') {
                // Host View (or Pass Mode)
                aiParams = { role: "HOST/PLAYER", word: state.secretWord, topic: state.topic };
            } else {
                aiParams = { role: "LOBBY", word: null, topic: null };
            }
            updateBatteryUI();
        }

        function updateBatteryUI() {
            const bars = "|||".substring(0, Math.min(3, aiChargesLeft));
            const txt = `BATTERY: ${bars} (${aiChargesLeft})`;
            const el = document.getElementById('ai-battery-display');
            if(el) {
                el.innerText = txt;
                el.style.color = aiChargesLeft > 0 ? 'var(--primary)' : 'var(--danger)';
            }
            const btn = document.getElementById('ai-send');
            if(btn) btn.disabled = aiChargesLeft <= 0;
        }

        function typeWriter(element, text, speed = 20) {
            let i = 0;
            element.classList.add('typing');
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    const container = document.getElementById('ai-messages');
                    container.scrollTop = container.scrollHeight;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing');
                }
            }
            type();
        }

        async function sendAIMessage() {
            if (aiChargesLeft <= 0) {
                addChatBubble("CRITICAL: BATTERY DEPLETED.", 'ai');
                return;
            }

            const input = document.getElementById('ai-input');
            const msg = input.value.trim();
            if (!msg) return;

            // Add User Message
            addChatBubble(msg, 'user');
            input.value = '';
            
            // Decrement Battery
            aiChargesLeft--;
            updateBatteryUI();

            // Check if Key Exists
            if (typeof AI_CONFIG === 'undefined' || !AI_CONFIG.API_KEY) {
                addChatBubble("ERROR: ai_key.js not found.", 'ai');
                return;
            }

            // Construct System Prompt
            let systemContext = `You are a tactical AI in a game called 'The Imposter'. Be brief, cryptic, and cyberpunk.`;
            if (aiParams.role === 'CITIZEN' || aiParams.role === 'HOST/PLAYER') {
                systemContext += ` The user is a Citizen. The Topic is ${aiParams.topic}. The Secret Word is ${aiParams.word}. Do NOT reveal the word directly, but give hints or strategies if asked.`;
            } else if (aiParams.role === 'IMPOSTER') {
                systemContext += ` The user is the IMPOSTER. The Topic is ${aiParams.topic}. They DO NOT know the word. Help them bluff or guess words related to the topic.`;
            } else if (aiParams.role === 'GLITCH') {
                systemContext += ` The user is the GLITCH. They want to be voted out. Help them act suspicious without being too obvious.`;
            }

            // Add Loading
            const loadingId = addChatBubble("Thinking...", 'ai');

            try {
                // GOOGLE GEMINI API LOGIC (Using variable model)
                const model = AI_CONFIG.MODEL || "gemini-1.5-flash-001";
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${AI_CONFIG.API_KEY}`;
                
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: systemContext + "\n\nUSER QUERY: " + msg }]
                        }]
                    })
                });

                const data = await response.json();
                
                // Remove Loading specific bubble only
                const loadBubble = document.getElementById(loadingId);
                if(loadBubble) loadBubble.remove();

                if (data.candidates && data.candidates.length > 0) {
                    const aiText = data.candidates[0].content.parts[0].text;
                    const aiBubbleId = addChatBubble("", 'ai'); // Create empty bubble
                    const aiBubble = document.getElementById(aiBubbleId);
                    typeWriter(aiBubble, aiText); // Stream text into it
                } else {
                    addChatBubble("API ERROR: " + (data.error ? data.error.message : "Unknown error"), 'ai');
                }
            } catch (e) {
                const loadBubble = document.getElementById(loadingId);
                if(loadBubble) loadBubble.remove();
                addChatBubble("CONNECTION FAILED: " + e.message, 'ai');
            }
        }

        function addChatBubble(text, type) {
            const div = document.createElement('div');
            div.className = `msg ${type}`;
            div.textContent = text; // Use textContent for safety
            // Generate unique ID to prevent collisions
            div.id = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            const container = document.getElementById('ai-messages');
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            return div.id;
        }

        function init() {
            // GLOBAL KEY LISTENER FOR ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === "Escape") {
                    const qr = document.getElementById('qrModal');
                    const ai = document.getElementById('ai-modal-overlay');
                    if (qr && qr.classList.contains('active')) closeModal();
                    if (ai && ai.style.display === 'flex') toggleAIChat();
                    // If in settings/history/stats (renderers), we can just go back to lobby
                    if (['HISTORY', 'STATS', 'SETTINGS'].includes(state.step)) {
                        state.step = 'LOBBY';
                        renderHostScreen();
                    }
                }
            });

            // Load Theme
            const savedTheme = localStorage.getItem('imposterTheme');
            if (savedTheme) {
                currentThemeIndex = parseInt(savedTheme);
                applyTheme();
            }

            initMatrix();
            try {
                if (params.has('data')) {
                    renderPlayerScreen();
                } else if (params.has('room')) {
                    renderRoomSelection();
                } else {
                    let saved = null;
                    try { saved = localStorage.getItem('imposterState'); } catch(e) {}
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        state = { ...state, ...parsed };
                        // Migration
                        if(!state.settings) state.settings = { timer: 180, imposterCount: 1, hasGlitch: false, timerMode: 'COUNTDOWN' };
                        if(!state.settings.timerMode) state.settings.timerMode = 'COUNTDOWN';
                        if(typeof state.imposterIndex !== 'undefined') { state.imposterIndices = [state.imposterIndex]; delete state.imposterIndex; }
                    }
                    if (!state.history) state.history = [];
                    if(state.step !== 'LOBBY') renderHostScreen(); else renderLobby();
                }
            } catch(err) {
                app.innerHTML = `<h1>ERROR</h1><p>Resetting...</p><button class='btn' onclick='localStorage.clear(); location.reload()'>RESET</button>`;
            }
        }

        // --- HOST LOGIC ---
        function addPlayer(presetName = null) {
            const input = document.getElementById('nameInput');
            const name = presetName || input.value.trim().toUpperCase();
            if (!name) return;
            if (state.players.includes(name)) return alert("Name taken!");
            playSfx('click');
            state.players.push(name);
            if(!presetName) input.value = '';
            saveState();
            renderLobby();
            if(!presetName) setTimeout(() => { document.getElementById('nameInput').focus(); }, 10);
        }

        function removePlayer(index) { state.players.splice(index, 1); saveState(); renderLobby(); }
        function togglePassMode() { state.passMode = !state.passMode; playSfx('click'); renderLobby(); }
        
        function adjustTimer(sec) { state.settings.timer = Math.max(60, state.settings.timer + sec); saveState(); renderLobby(); }
        function toggleImposterCount() { state.settings.imposterCount = (state.settings.imposterCount === 1) ? 2 : 1; saveState(); renderLobby(); }
        function toggleGlitch() { state.settings.hasGlitch = !state.settings.hasGlitch; saveState(); renderLobby(); }
        function toggleTimerMode() { state.settings.timerMode = (state.settings.timerMode === 'COUNTDOWN') ? 'STOPWATCH' : 'COUNTDOWN'; saveState(); renderLobby(); }

        function resetGame() { 
            playSfx('click'); 
            state.step = 'LOBBY'; 
            state.topic = null; state.secretWord = null; 
            state.imposterIndices = []; state.glitchIndex = null;
            state.startingPlayer = null; 
            document.body.classList.remove('meltdown'); 
            document.body.classList.remove('glitch-mode');
            saveState(); 
            renderLobby(); 
        }

        function startGame(topicKey) {
            if (state.players.length < 3) return alert("Need 3+ players!");
            if (state.settings.imposterCount === 2 && state.players.length < 5) return alert("Need 5+ players for 2 Imposters!");
            if (state.settings.hasGlitch && state.players.length < 4) return alert("Need 4+ players for Glitch!");

            playSfx('scan');
            state.topic = topicKey;

            if (topicKey === 'CUSTOM') {
                const input = prompt("Enter words separated by comma (e.g. Apple, Banana)");
                if (!input) return;
                state.customWords = input.split(',').map(w => w.trim()).filter(w => w.length > 0);
                if (state.customWords.length < 2) return alert("Need 2+ words!");
                state.secretWord = state.customWords[Math.floor(Math.random() * state.customWords.length)];
                state.secretHint = "Custom Word";
            } else if (topicKey === 'CHAOS') {
                const cats = Object.keys(GAME_DATA);
                const randomCat = cats[Math.floor(Math.random() * cats.length)];
                const dataList = GAME_DATA[randomCat];
                const item = dataList[Math.floor(Math.random() * dataList.length)];
                state.secretWord = item.w;
                state.secretHint = item.h;
                state.topic = "CHAOS (" + randomCat + ")"; 
            } else {
                const dataList = GAME_DATA[topicKey];
                const item = dataList[Math.floor(Math.random() * dataList.length)];
                state.secretWord = item.w;
                state.secretHint = item.h;
            }

            let indices = state.players.map((_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }

            state.imposterIndices = [];
            state.glitchIndex = null;

            for(let k=0; k<state.settings.imposterCount; k++) {
                state.imposterIndices.push(indices.pop());
            }

            if(state.settings.hasGlitch && indices.length > 0) {
                state.glitchIndex = indices.pop();
            }

            state.startingPlayer = state.players[Math.floor(Math.random() * state.players.length)];
            state.startTime = null;
            state.votedIndex = null;
            state.step = state.passMode ? 'PASS_PREP' : 'QR_PREP';
            state.passIndex = 0;
            saveState();
            renderHostScreen();
        }

        function startRound() { 
            playSfx('alarm'); 
            state.step = 'GAME'; 
            state.startTime = Date.now(); 
            state.endTime = Date.now() + (state.settings.timer * 1000);
            saveState(); 
            renderHostScreen(); 
            requestWakeLock();
            setTimeout(animateStartingPlayer, 500);
            scheduleGlitch(); 
        }

        // --- VISUAL GLITCH LOGIC ---
        function scheduleGlitch() {
            if(state.step !== 'GAME') return;
            const time = Math.random() * 25000 + 20000;
            setTimeout(() => {
                if(state.step !== 'GAME') return;
                triggerGlitchEffect();
                scheduleGlitch();
            }, time);
        }

        function triggerGlitchEffect() {
            playSfx('scan');
            document.body.classList.add('glitch-mode');
            setTimeout(() => {
                document.body.classList.remove('glitch-mode');
            }, 2500);
        }

        function startVoting() { 
            playSfx('alarm'); 
            state.step = 'VOTING'; 
            document.body.classList.remove('meltdown'); 
            document.body.classList.remove('glitch-mode');
            saveState(); 
            renderHostScreen(); 
        }
        
        function selectVote(i) { playSfx('click'); state.votedIndex = (state.votedIndex === i) ? null : i; renderHostScreen(); }

        function submitVote() {
            if (state.votedIndex === null) return alert("Select the suspect!");
            playSfx('reveal');
            state.step = 'RESULTS';
            
            let winner = "CITIZENS";
            if (state.imposterIndices.includes(state.votedIndex)) {
                winner = "CITIZENS"; 
            } else if (state.votedIndex === state.glitchIndex) {
                winner = "THE GLITCH"; 
            } else {
                winner = "IMPOSTERS"; 
            }

            state.history.unshift({
                date: new Date().toLocaleString(),
                topic: state.topic,
                word: state.secretWord,
                imposters: state.imposterIndices.map(i => state.players[i]).join(', '),
                winner: winner
            });
            if(state.history.length > 50) state.history.pop();

            saveState();
            renderHostScreen();
            
            setTimeout(() => { 
                playSfx(winner === "CITIZENS" || winner === "THE GLITCH" ? 'win' : 'lose'); 
                if(winner === "CITIZENS") try{ confetti({ particleCount: 200, colors: ['#0f0', '#fff'] }); }catch(e){} 
                if(winner === "THE GLITCH") try{ confetti({ particleCount: 200, colors: ['#ffaa00', '#fff'] }); }catch(e){} 
            }, 500);
        }

        function saveState() { try { if(!params.has('data') && !params.has('room')) localStorage.setItem('imposterState', JSON.stringify(state)); } catch(e) {} }

        // --- RENDERERS ---
        function renderHostScreen() {
            if(state.step === 'LOBBY') renderLobby();
            else if(state.step === 'QR_PREP') renderQrPrep();
            else if(state.step === 'PASS_PREP') renderPassPrep();
            else if(state.step === 'GAME') renderGame();
            else if(state.step === 'VOTING') renderVoting();
            else if(state.step === 'RESULTS') renderResults();
            else if(state.step === 'HISTORY') renderHistory();
            else if(state.step === 'STATS') renderStats();
            else if(state.step === 'SETTINGS') renderSettings();
        }

        function renderLobby() {
            const availablePresets = PRESET_NAMES.filter(n => !state.players.includes(n));
            const timerMin = Math.floor(state.settings.timer / 60);

            app.innerHTML = `
                <h1>THE IMPOSTER</h1>
                <p>CYBERPUNK EDITION</p>
                <div class="input-group">
                    <input type="text" id="nameInput" placeholder="ADD AGENT NAME" autocomplete="off" onkeydown="if(event.key==='Enter') addPlayer()">
                    <button onclick="addPlayer()" style="background:none; border:none; color:var(--primary); font-size:1.5rem;">+</button>
                </div>
                
                <div style="margin-bottom:15px; display:flex; flex-wrap:wrap; justify-content:center; gap:5px;">
                   ${availablePresets.map(p => `<div class="preset-chip" onclick="addPlayer('${p}')">+ ${p}</div>`).join('')}
                </div>

                <div class="grid-names">
                    ${state.players.map((p, i) => `<div class="name-chip" onclick="removePlayer(${i})">${p}</div>`).join('')}
                </div>
                
                <div class="settings-panel">
                    <h2 style="font-size:0.8rem; margin:0 0 10px 0;">MISSION PARAMETERS</h2>
                    <div class="control-row">
                        <span class="control-label">IMPOSTERS:</span>
                        <button class="btn btn-small" style="width:40px" onclick="toggleImposterCount()">${state.settings.imposterCount}</button>
                    </div>
                    <div class="control-row">
                        <span class="control-label">GLITCH:</span>
                        <label class="switch"><input type="checkbox" ${state.settings.hasGlitch ? 'checked' : ''} onchange="toggleGlitch()"><span class="slider"></span></label>
                    </div>
                    <div class="control-row">
                        <span class="control-label">MODE:</span>
                        <button class="btn btn-small" style="width:auto; padding:5px 10px;" onclick="toggleTimerMode()">${state.settings.timerMode}</button>
                    </div>
                    ${state.settings.timerMode === 'COUNTDOWN' ? `
                    <div class="control-row">
                        <span class="control-label">TIMER:</span>
                        <button class="btn btn-small" onclick="adjustTimer(-60)">-</button>
                        <span class="control-value">${timerMin}m</span>
                        <button class="btn btn-small" onclick="adjustTimer(60)">+</button>
                    </div>` : ''}
                     <div class="control-row">
                         <span class="control-label">PASS MODE:</span>
                         <label class="switch"><input type="checkbox" ${state.passMode ? 'checked' : ''} onchange="togglePassMode()"><span class="slider"></span></label>
                     </div>
                </div>
                
                <div style="display:flex; justify-content:center; gap:10px; margin-top:10px;">
                    <button class="btn btn-secondary btn-small" onclick="state.step='STATS'; renderHostScreen();">LEADERBOARD</button>
                    <button class="btn btn-secondary btn-small" onclick="state.step='HISTORY'; renderHostScreen();">LOGS</button>
                    <button class="btn btn-secondary btn-small" onclick="state.step='SETTINGS'; renderHostScreen();">DATA</button>
                </div>

                ${state.players.length >= 3 ? `
                    <div class="topic-grid">
                        <div class="topic-card chaos-card" onclick="startGame('CHAOS')">â ï¸ CHAOS MODE</div>
                        ${Object.keys(GAME_DATA).map(t => `<div class="topic-card" onclick="startGame('${t}')">${t}</div>`).join('')}
                        <div class="topic-card" style="border-color:var(--secondary); color:var(--secondary)" onclick="startGame('CUSTOM')">Custom...</div>
                    </div>
                ` : '<p style="margin-top:30px; font-size:0.8rem;">RECRUIT 3 AGENTS TO START</p>'}
            `;
        }

        function renderStats() {
            const stats = {};
            const allKnownPlayers = new Set([...state.players]);
            state.history.forEach(h => {
                if(h.imposters) h.imposters.split(', ').forEach(n => allKnownPlayers.add(n));
            });
            allKnownPlayers.forEach(p => { stats[p] = { plays: 0, citWins: 0, impWins: 0, totalWins: 0 }; });
            
            state.history.forEach(h => {
                const imps = (h.imposters || "").split(', ');
                if (h.winner === "IMPOSTERS") {
                    imps.forEach(impName => { if(stats[impName]) { stats[impName].impWins++; stats[impName].totalWins++; } });
                }
            });
            
            state.history.forEach(h => {
                const imps = (h.imposters || "").split(', ');
                state.players.forEach(p => {
                    const wasImp = imps.includes(p);
                    if (h.winner === "CITIZENS" && !wasImp && stats[p]) {
                        stats[p].citWins++; stats[p].totalWins++;
                    }
                });
            });

            const sorted = Object.keys(stats).filter(p => state.players.includes(p)).sort((a,b) => stats[b].totalWins - stats[a].totalWins);

            app.innerHTML = `
                <h2>LEADERBOARD</h2>
                <p style="font-size:0.7rem; opacity:0.6;">(Calculated for current lobby)</p>
                <div style="max-height:60vh; overflow-y:auto; width:100%; margin: 20px 0;">
                    ${sorted.length === 0 ? '<p>No data yet.</p>' : sorted.map((p, i) => `
                        <div class="stat-card">
                            <div style="display:flex; align-items:center;">
                                <span class="stat-rank">#${i+1}</span>
                                <div><strong>${p}</strong></div>
                            </div>
                            <div style="font-size:0.8rem; text-align:right;">
                                <span style="color:var(--primary)">C:${stats[p].citWins}</span> | 
                                <span style="color:var(--secondary)">I:${stats[p].impWins}</span> <br>
                                TOTAL: ${stats[p].totalWins}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary" onclick="state.step='LOBBY'; renderHostScreen();">BACK</button>
            `;
        }

        function renderSettings() {
            app.innerHTML = `
                <h2>DATA MANAGEMENT</h2>
                <div style="margin: 30px 0;">
                    <p>Backup or Restore Mission Data</p>
                    <button class="btn" onclick="exportData()">DOWNLOAD DATA</button>
                    <div style="position:relative; margin-top:15px;">
                        <button class="btn btn-secondary">UPLOAD DATA</button>
                        <input type="file" onchange="importData(this)" style="position:absolute; left:0; top:0; width:100%; height:100%; opacity:0; cursor:pointer;">
                    </div>
                    <button class="btn btn-danger" onclick="if(confirm('Wipe all data?')){localStorage.clear(); location.reload();}" style="margin-top:40px;">FACTORY RESET</button>
                    <button class="btn btn-secondary" onclick="state.step='LOBBY'; renderHostScreen();" style="margin-top:20px;">BACK</button>
                </div>
            `;
        }

        function exportData() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "imposter_backup_" + Date.now() + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        function importData(input) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const loaded = JSON.parse(e.target.result);
                    if(loaded.players && loaded.history) {
                        state = loaded;
                        saveState();
                        alert("Data Loaded Successfully");
                        state.step = 'LOBBY';
                        renderHostScreen();
                    } else { alert("Invalid File"); }
                } catch(err) { alert("Error reading file"); }
            };
            reader.readAsText(file);
        }

        function renderHistory() {
            app.innerHTML = `
                <h2>MISSION LOGS</h2>
                <div style="max-height:60vh; overflow-y:auto; width:100%; margin: 20px 0;">
                    ${state.history.length === 0 ? '<p>No records found.</p>' : state.history.map(h => `
                        <div class="history-item">
                            <div>
                                <strong style="color:white">${h.topic}</strong>: ${h.word}<br>
                                <span style="opacity:0.6">${h.date}</span>
                            </div>
                            <div style="text-align:right">
                                <span class="${h.winner === 'CITIZENS' ? 'history-win' : 'history-loss'}">${h.winner}</span><br>
                                <span style="font-size:0.7rem; color:var(--secondary)">Imps: ${h.imposters}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-secondary" onclick="state.step='LOBBY'; renderHostScreen();">BACK</button>
            `;
        }

        function renderQrPrep() {
            app.innerHTML = `
                <h2>Topic: ${state.topic}</h2>
                <div class="grid-names" style="gap:15px; margin-top:30px;">
                    <button class="btn" style="border-color:var(--accent); color:var(--accent); padding:25px;" onclick="showRoomQR()">
                        ð  SHOW ROOM QR <br><span style="font-size:0.8rem">(Scan once for everyone)</span>
                    </button>
                </div>
                <p style="margin:20px 0;">-- OR INDIVIDUAL --</p>
                <div class="grid-names">
                    ${state.players.map((p, i) => `<button class="btn btn-secondary" onclick="showPlayerQR(${i})" style="width:auto; padding:10px;">ð± ${p}</button>`).join('')}
                </div>
                <button class="btn" style="margin-top:30px;" onclick="startRound()">START MISSION</button>
                <button class="btn btn-secondary" onclick="resetGame()" style="margin-top:10px;">ABORT</button>
            `;
        }

        function renderGame() {
            app.innerHTML = `
                <h2 style="color:var(--primary)">MISSION ACTIVE</h2>
                <p>Topic: <strong style="color:white">${state.topic}</strong></p>
                <div id="starter-box" class="turn-display">
                    STARTS: <span id="starter-name">DECRYPTING...</span>
                </div>
                <div id="timer" style="font-size: 5rem; font-family:var(--font); color:var(--text); text-shadow: 0 0 20px var(--primary); margin: 10px 0;">0:00</div>
                <div style="display:flex; justify-content:center; gap:20px; opacity:0.8; margin-bottom:20px;">
                    <button class="btn btn-small" style="width:70px" onclick="modifyTime(-10)">-10S</button>
                    <button class="btn btn-small" style="width:70px" onclick="modifyTime(10)">+10S</button>
                </div>
                <button class="btn btn-secondary btn-small" onclick="spinNextPlayer()">ð² SPIN NEXT SPEAKER</button>
                <div style="margin-top:40px;">
                    <button class="btn btn-danger" onclick="startVoting()">EMERGENCY MEETING / VOTE</button>
                </div>
            `;
            const timerEl = document.getElementById('timer');
            let playedAlarm = false;

            const update = () => {
                if(state.step !== 'GAME') return;
                const now = Date.now();
                let display = "0:00";
                
                if (state.settings.timerMode === 'STOPWATCH') {
                    const diff = Math.floor((now - state.startTime) / 1000);
                    const m = Math.floor(diff / 60);
                    const s = (diff % 60).toString().padStart(2, '0');
                    display = `${m}:${s}`;
                } else {
                    const remaining = Math.floor((state.endTime - now) / 1000);
                    if (remaining > 0) {
                        const m = Math.floor(remaining / 60);
                        const s = (remaining % 60).toString().padStart(2, '0');
                        display = `${m}:${s}`;
                        if(remaining <= 30) {
                            timerEl.classList.add('critical');
                            document.body.classList.add('meltdown');
                        } else {
                            timerEl.classList.remove('critical');
                            document.body.classList.remove('meltdown');
                        }
                    } else {
                        // Negative Timer Logic
                        const overtime = Math.abs(remaining);
                        const s = (overtime % 60).toString().padStart(2, '0');
                        display = `-${Math.floor(overtime/60)}:${s}`;
                        
                        timerEl.classList.add('critical');
                        document.body.classList.add('meltdown');
                        if(!playedAlarm) { playSfx('alarm'); playedAlarm = true; }
                    }
                }
                
                if(timerEl) timerEl.innerText = display;
                requestAnimationFrame(update);
            };
            update();
        }

        function modifyTime(seconds) {
            if (state.settings.timerMode === 'STOPWATCH') {
                state.startTime -= (seconds * 1000);
            } else {
                state.endTime += (seconds * 1000);
            }
        }

        function animateStartingPlayer() {
            const el = document.getElementById('starter-name');
            const box = document.getElementById('starter-box');
            if(!el) return;
            box.classList.add('animate');
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let iterations = 0;
            const target = state.startingPlayer;
            const interval = setInterval(() => {
                playSfx('roulette');
                el.innerText = target.split('').map((letter, index) => {
                    if(index < iterations) return target[index];
                    return chars[Math.floor(Math.random() * chars.length)]
                }).join('');
                if(iterations >= target.length){ 
                    clearInterval(interval);
                    box.classList.remove('animate');
                    box.style.background = 'rgba(0, 255, 0, 0.2)';
                    box.style.borderColor = 'var(--primary)';
                    box.style.color = 'var(--primary)';
                }
                if(Math.random() > 0.5) iterations += 0.5; 
            }, 50);
        }

        function spinNextPlayer() {
            const el = document.getElementById('starter-name');
            const box = document.getElementById('starter-box');
            box.style.background = 'transparent';
            box.style.borderColor = 'var(--accent)';
            box.style.color = 'var(--accent)';
            box.classList.add('animate');
            box.innerHTML = `NEXT: <span id="spin-target">...</span>`;
            let spinCount = 0;
            const spinInt = setInterval(() => {
                playSfx('roulette');
                const randomP = state.players[Math.floor(Math.random() * state.players.length)];
                document.getElementById('spin-target').innerText = randomP;
                spinCount++;
                if(spinCount > 15) {
                    clearInterval(spinInt);
                    box.classList.remove('animate');
                    box.style.background = 'rgba(255, 255, 0, 0.1)';
                    box.style.color = 'yellow';
                    box.style.borderColor = 'yellow';
                }
            }, 80);
        }

        function renderVoting() {
            app.innerHTML = `
                <h1 style="color:var(--secondary); animation:pulse-red 2s infinite;">VOTING PHASE</h1>
                <p>Who is the Imposter?</p>
                <div class="voting-grid">
                    ${state.players.map((p, i) => `<div class="vote-card ${state.votedIndex === i ? 'selected' : ''}" onclick="selectVote(${i})"><div style="font-size:2rem; margin-bottom:10px;">ð¤</div><div style="font-weight:bold;">${p}</div></div>`).join('')}
                </div>
                <button class="btn btn-danger" onclick="submitVote()">EXECUTE SELECTED</button>
            `;
        }

        function renderResults() {
            const isImposterVoted = state.imposterIndices.includes(state.votedIndex);
            const isGlitchVoted = (state.votedIndex === state.glitchIndex);
            
            let resultTitle, resultMsg, bannerClass;
            
            if (isGlitchVoted) {
                resultTitle = "GLITCH WINS";
                resultMsg = "System Error: The Glitch Wanted Disconnection";
                bannerClass = "win-glitch";
            } else if (isImposterVoted) {
                resultTitle = "CITIZENS WIN";
                resultMsg = "Imposter Neutralized";
                bannerClass = "win-citizen";
            } else {
                resultTitle = "IMPOSTERS WIN";
                resultMsg = "System Compromised. Wrong Agent Ejected.";
                bannerClass = "win-imposter";
            }

            const imposterNames = state.imposterIndices.map(i => state.players[i]).join(' & ');
            
            app.innerHTML = `
                <div class="result-banner ${bannerClass}">
                    <h1 style="font-size:2.5rem; text-shadow:none; color:inherit;">${resultTitle}</h1>
                    <p style="color:inherit; margin:0;">${resultMsg}</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
                    <div style="background:#111; padding:15px; border:1px solid #333;"><small>SECRET WORD</small><br><strong style="color:var(--primary); font-size:1.5rem;">${state.secretWord}</strong></div>
                    <div style="background:#111; padding:15px; border:1px solid #333;"><small>REAL IMPOSTERS</small><br><strong style="color:var(--secondary); font-size:1.5rem;">${imposterNames}</strong></div>
                    ${state.glitchIndex !== null ? `<div style="background:#111; padding:15px; border:1px solid #333;"><small>THE GLITCH</small><br><strong style="color:var(--warning); font-size:1.5rem;">${state.players[state.glitchIndex]}</strong></div>` : ''}
                </div>
                <button class="btn" style="margin-top:20px" onclick="resetGame()">NEW MISSION</button>
            `;
        }

        // --- UPDATED MINIFIED ROOM LOGIC ---
        function renderRoomSelection() {
            let roomData;
            try { 
                const raw = params.get('room');
                roomData = JSON.parse(safeAtob(raw)); 
            } catch(e) { app.innerHTML = "ROOM ERROR"; return; }
            
            // Check if minified or legacy
            let players = roomData.players || [];
            if (roomData.p) {
                // Minified format: [Name, RoleInt, Secret]
                players = roomData.p.map(arr => {
                    const rMap = ['CITIZEN', 'IMPOSTER', 'GLITCH'];
                    const r = rMap[arr[1]];
                    return {
                        name: arr[0],
                        role: r,
                        word: (r === 'CITIZEN') ? arr[2] : null,
                        hint: (r === 'IMPOSTER') ? arr[2] : null
                    };
                });
            }
            
            // Store Room ID
            const rId = roomData.id || roomData.i;
            const rTopic = roomData.topic || roomData.t;

            const savedName = localStorage.getItem('imposter_id_' + rId);
            if(savedName) {
                const p = players.find(x => x.name === savedName);
                if(p) return renderPlayerIdentity(p.name, p.role, p.word, p.hint, rTopic);
            }

            app.innerHTML = `<h2>SELECT IDENTITY</h2><div class="room-list" style="display:flex; flex-direction:column; gap:10px; max-height:60vh; overflow-y:auto;">
                ${players.map(p => `<button class="btn" style="text-align:left; display:flex; justify-content:space-between;" onclick="claimIdentity('${p.name}', '${p.role}', '${p.word}', '${p.hint}', '${rTopic}', '${rId}')"><strong>${p.name}</strong><span>ð</span></button>`).join('')}
            </div>`;
        }

        function claimIdentity(name, role, word, hint, topic, roomId) {
            if(confirm(`Are you ${name}?`)) {
                localStorage.setItem('imposter_id_' + roomId, name);
                renderPlayerIdentity(name, role, word, hint, topic);
            }
        }

        function renderPlayerIdentity(name, role, word, hint, topic) {
            let displayWord = word;
            let displayHint = "Citizen";
            let color = 'color:var(--primary)';

            if (role === 'IMPOSTER') {
                displayWord = "YOU ARE THE<br>IMPOSTER";
                displayHint = "HINT: " + hint;
                color = 'color:var(--secondary)';
            } else if (role === 'GLITCH') {
                displayWord = "YOU ARE THE<br>GLITCH";
                displayHint = "OBJECTIVE: GET VOTED OUT";
                color = 'color:var(--warning)';
            }

            app.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:20px;">
                    <span>AGENT: <strong>${name}</strong></span><span style="font-size:0.8rem; opacity:0.7;">${topic}</span>
                </div>
                <div class="secret-box" id="mobileBox">
                    <div class="fingerprint-icon">âï¸</div>
                    <div class="secret-content" style="${color}">${displayWord}</div>
                    ${role !== 'CITIZEN' ? `<div class="hint-text">${displayHint}</div>` : ''}
                </div>
                <p style="font-size:0.8rem; margin-top:20px;">HOLD TO DECRYPT</p>
                <div style="margin-top:50px; border-top:1px solid #333; padding-top:20px;">
                    <p style="font-size:0.8rem; margin-bottom:5px;">TOOLS</p>
                    <button class="btn btn-secondary" onclick="this.style.background='var(--secondary)'; this.innerText='VOTING...';">ð³ï¸ OPEN VOTING GUIDE</button>
                </div>
            `;
            bindRevealEvents('mobileBox', role !== 'CITIZEN');
        }

        function renderPlayerScreen() {
            let data;
            try { data = JSON.parse(safeAtob(params.get('data'))); } catch(e) { app.innerHTML = "LINK ERROR"; return; }
            renderPlayerIdentity(data.name, data.role, data.word, data.hint, data.topic);
        }

        function bindRevealEvents(id, isSecretRole) {
            const box = document.getElementById(id);
            if(!box) return;
            const reveal = (e) => {
                if(e.cancelable) e.preventDefault();
                if(!box.classList.contains('revealing')) {
                    playSfx('reveal');
                    if(isSecretRole) pulse([100, 50, 100]); else pulse(20);
                }
                box.classList.add('revealing');
            };
            const hide = (e) => { if(e.cancelable) e.preventDefault(); box.classList.remove('revealing'); };
            ['touchstart', 'mousedown'].forEach(evt => box.addEventListener(evt, reveal, {passive:false}));
            ['touchend', 'mouseup', 'mouseleave'].forEach(evt => box.addEventListener(evt, hide));
        }

        function showPlayerQR(i) {
            playSfx('click');
            const p = state.players[i];
            let role = 'CITIZEN';
            let word = state.secretWord;
            let hint = null;
            if (state.imposterIndices.includes(i)) {
                role = 'IMPOSTER'; word = null; hint = state.secretHint;
            } else if (i === state.glitchIndex) {
                role = 'GLITCH'; word = null;
            }
            const payload = { name: p, topic: state.topic, role: role, word: word, hint: hint };
            generateQR(payload, `Scan for ${p}`, 'data');
        }

        // --- NEW COMPRESSED QR LOGIC ---
        function showRoomQR() {
            playSfx('click');
            try {
                const id = Date.now().toString();
                const minPlayers = state.players.map((p, i) => {
                    let rInt = 0; // Citizen
                    let secret = state.secretWord;
                    
                    if (state.imposterIndices.includes(i)) {
                        rInt = 1; secret = state.secretHint;
                    } else if (i === state.glitchIndex) {
                        rInt = 2; secret = null;
                    }
                    return [p, rInt, secret];
                });

                const payload = { i: id, t: state.topic, p: minPlayers };
                generateQR(payload, "Scan to Join Room", 'room');
            } catch(e) {
                alert("Error generating QR: " + e.message);
            }
        }

        function generateQR(payload, text, param) {
            try {
                const jsonStr = JSON.stringify(payload);
                const encoded = safeBtoa(jsonStr);
                const url = `${window.location.origin}${window.location.pathname}?${param}=${encoded}`;
                
                const target = document.getElementById('qrTarget');
                target.innerHTML = '';
                document.querySelector('#qrModal h2').innerText = text;
                
                // If payload is huge, we might still hit limits, but minification helps significantly
                new QRCode(target, { text: url, width: 250, height: 250, correctLevel: QRCode.CorrectLevel.L });
                document.getElementById('qrModal').classList.add('active');
            } catch(e) {
                alert("Data too large for QR Code. Try fewer players.");
            }
        }

        function closeModal() { playSfx('click'); document.getElementById('qrModal').classList.remove('active'); }

        function renderPassPrep() {
            const p = state.players[state.passIndex];
            app.innerHTML = `<h2>PASS DEVICE</h2><h1 style="font-size:2.5rem; color:var(--primary); margin:30px 0;">${p}</h1><button class="btn" onclick="renderPassReveal()">I AM ${p}</button>`;
        }
        function renderPassReveal() {
            const i = state.passIndex;
            let displayWord = state.secretWord;
            let displayHint = "Citizen";
            let color = 'color:var(--primary)';
            let isSecret = false;
            if (state.imposterIndices.includes(i)) {
                displayWord = "YOU ARE THE<br>IMPOSTER";
                displayHint = "HINT: " + state.secretHint;
                color = 'color:var(--secondary)';
                isSecret = true;
            } else if (i === state.glitchIndex) {
                displayWord = "YOU ARE THE<br>GLITCH";
                displayHint = "OBJECTIVE: GET VOTED OUT";
                color = 'color:var(--warning)';
                isSecret = true;
            }
            app.innerHTML = `<h2>IDENTITY</h2><div class="secret-box" id="passBox"><div class="fingerprint-icon">âï¸</div><div class="secret-content" style="${color}">${displayWord}</div>${isSecret ? `<div class="hint-text">${displayHint}</div>` : ''}</div><button class="btn" id="nextBtn" style="opacity:0; pointer-events:none;" onclick="state.passIndex++; state.passIndex >= state.players.length ? startRound() : renderHostScreen()">CONFIRM & CLEAR</button>`;
            bindRevealEvents('passBox', isSecret);
            const box = document.getElementById('passBox');
            const enableBtn = () => { document.getElementById('nextBtn').style.opacity=1; document.getElementById('nextBtn').style.pointerEvents='all'; };
            box.addEventListener('mousedown', enableBtn);
            box.addEventListener('touchstart', enableBtn);
        }

        init();

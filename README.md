# 🤖 THE IMPOSTER: Cyberpunk Edition

> "Interrogate. Find the Glitch. Trust No One."

**The Imposter** is a local multiplayer party game of social deduction, deception, and word association, wrapped in a high-fidelity Cyberpunk aesthetic. 

Built as a **single-file web application**, it requires no server, no internet connection (after loading), and runs smoothly on any mobile device or tablet.

## 🎮 How To Play

### 1. Mission Setup (The Lobby)
1.  **Host:** One player opens the game on a phone or tablet. This device controls the game.
2.  **Recruit:** Enter the names of all players (3+ players required).
3.  **Settings:** 
    *   Toggle **QR Mode** (Scan phones) or **Pass Mode** (Pass the device around).
    *   Adjust the **Timer**.
    *   Enable extra roles (Imposter count / The Glitch).

### 2. Identity Distribution
The game will assign a hidden role to every player:
*   **Citizens (Agents):** You receive a **Secret Word** (e.g., "Pizza").
*   **The Imposter:** You see **"YOU ARE THE IMPOSTER"**. You do *not* know the secret word.
*   **The Glitch (Optional):** You see **"YOU ARE THE GLITCH"**. You do not know the word.

### 3. The Interrogation
*   The timer starts.
*   Players take turns saying **one word** related to the secret word (e.g., if the word is "Pizza", you might say "Cheese").
*   **The Goal:**
    *   **Citizens:** Prove you know the word without giving it away to the Imposter.
    *   **Imposter:** Blend in, lie, and deduce the word from what others are saying.
    *   **Glitch:** Act suspicious enough to get voted out.

### 4. Emergency Meeting (Voting)
At any point (or when the timer melts down), players can call a vote.
*   Select the player you suspect is the Imposter.
*   The player with the most votes is "Eliminated."

### 5. Win Conditions
*   🟢 **Citizens Win:** If they vote out the **Imposter**.
*   🟣 **Imposters Win:** If the Citizens vote out an innocent Agent, or if the timer runs out (depending on house rules).
*   🟠 **The Glitch Wins:** If the Citizens vote out the **Glitch**.

---

## 👥 The Roles

| Role | Color | Objective |
| :--- | :--- | :--- |
| **AGENT (Citizen)** | 🟢 Green | Find the Imposter. Protect the secret word. |
| **IMPOSTER** | 🟣 Purple | Blend in. Don't get caught. Figure out the word. |
| **THE GLITCH** | 🟠 Orange | **Chaos Agent.** Your only goal is to trick the group into voting for you. |

---

## ⚡ System Features

*   **📱 Mobile-First Design:** Optimized for touchscreens, with wake-lock to keep screens on.
*   **💾 Local Save System:** Auto-saves progress, names, and stats to your browser's LocalStorage.
*   **⏱️ Advanced Timer:** Countdown or Stopwatch modes with visual "Reactor Meltdown" effects.
*   **🎲 Chaos Mode:** A randomized category mode where Citizens know the category, but Imposters see nothing.
*   **🏆 Leaderboard:** Tracks wins for Agents (C) and Imposters (I).
*   **📂 Import/Export:** Transfer your leaderboard and player history to another device via JSON.
*   **🎨 Cyberpunk VFX:** Matrix rain, scanlines, glitch text, and neon UI.

---

## 🛠️ Installation & Usage

There is no installation required! This is a **serverless** web app.

### Option 1: Run Locally
1.  Download the `index.html` file from this repository.
2.  Open it in any modern web browser (Chrome, Safari, Firefox).

### Option 2: Host it (GitHub Pages)
1.  Fork this repository.
2.  Go to **Settings** > **Pages**.
3.  Select `main` branch and save.
4.  Your game is now live at `your-username.github.io/imposter`.

### OR play right away at notalec1.github.io/imposter. Have fun!

---

## 🏗️ Technologies

*   **HTML5 / CSS3** (CSS Variables, Grid, Flexbox, Keyframe Animations)
*   **Vanilla JavaScript** (ES6+)
*   **Libraries:** 
    *   `qrcode.js` (for QR code generation)
    *   `canvas-confetti` (for win celebrations)
    *   `Google Fonts` (Space Grotesk)

---

> *System Status: ONLINE. Trust no one.*

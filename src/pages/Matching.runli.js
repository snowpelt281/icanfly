// Treat $w as any for dynamic selectors in this JS file
/** @type {any} */
const wix = /** @type {any} */ ($w);

function select(id) {
  return wix(id);
}

const emojis = ["🐵", "🐶", "🐱", "🐸", "🐰", "🐼"];
const NUM_PAIRS = emojis.length;
const buttonIds = Array.from({ length: NUM_PAIRS * 2 }, (_, i) => `#button${i + 5}`);

let cards = [];
let flipped = [];
let locked = false;
let matchedPairs = 0;
let timerInterval = null;
let timeElapsed = 0;
let moves = 0;
let winCount = 0;

// Utility: set button label/text and enabled/disabled (defensive)
function setButton(id, value, enabled) {
  const el = select(id);
  if (!el) {
    console.warn("setButton: no element for", id);
    return;
  }

  if ("label" in el) el.label = value;
  else if ("text" in el) el.text = value;
  else console.warn("setButton: element has no label/text", el);

  if (enabled && typeof el.enable === "function") el.enable();
  else if (!enabled && typeof el.disable === "function") el.disable();
}

// Shuffle array in-place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generate shuffled cards
function generateCards() {
  const pairs = [...emojis, ...emojis];
  shuffle(pairs);
  cards = pairs.map((value, index) => ({ id: buttonIds[index], value }));
}

// Reset game state (does NOT reshuffle)
function resetGameState() {
  flipped = [];
  locked = false;
  matchedPairs = 0;
  moves = 0;
  timeElapsed = 0;
  const text24 = $w("#text24");
  if (text24 && typeof text24.hide === "function") text24.hide();
  stopTimer();
  updateTimerDisplay();
  updateMovesDisplay();
  updateWinCounterDisplay();
  cards.forEach(card => setButton(card.id, "❓", true));
}

// Full new game (reshuffle, reset, timer)
function startMemoryGame() {
  generateCards();
  resetGameState();
  startTimer();
}

// Timer
function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timeElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, "0");
  const seconds = (timeElapsed % 60).toString().padStart(2, "0");
  const el = $w("#text25");
  if (el) el.text = `${minutes}:${seconds}`;
}

function updateMovesDisplay() {
  const el = $w("#text26");
  if (el) el.text = `Moves: ${moves}`;
}

function updateWinCounterDisplay() {
  const el = $w("#text27");
  if (el) el.text = `Wins: ${winCount}`;
}

function checkWin() {
  if (matchedPairs === NUM_PAIRS) {
    stopTimer();
    winCount++;
    updateWinCounterDisplay();
    const text24 = $w("#text24");
    const timeText = $w("#text25") ? $w("#text25").text : "00:00";
    if (text24) {
      text24.text = `🎉 You won in ${moves} moves and ${timeText}!`;
      if (typeof text24.show === "function") text24.show("fade");
    }
    cards.forEach(card => setButton(card.id, card.value, false));
  }
}

// Card click logic
function handleCardClick(index) {
  if (locked) return;
  if (!cards[index]) return;

  const card = cards[index];
  const el = select(card.id);
  if (!el) {
    console.warn("handleCardClick: element not found for", card.id);
    return;
  }

  let currentLabel = "";
  if ("label" in el) currentLabel = el.label || "";
  else if ("text" in el) currentLabel = el.text || "";

  if (currentLabel !== "❓") return;

  setButton(card.id, card.value, false);
  flipped.push(index);

  if (flipped.length === 2) {
    locked = true;
    moves++;
    updateMovesDisplay();
    const [idx1, idx2] = flipped;
    if (cards[idx1].value === cards[idx2].value) {
      flipped = [];
      matchedPairs++;
      locked = false;
      checkWin();
    } else {
      setTimeout(() => {
        setButton(cards[idx1].id, "❓", true);
        setButton(cards[idx2].id, "❓", true);
        flipped = [];
        locked = false;
      }, 800);
    }
  }
}

// Attach handlers ONCE (Wix Velo: use .onClick, NOT .onclick)
function attachHandlersOnce() {
  buttonIds.forEach((id, i) => {
    const btn = select(id);
    if (!btn) {
      console.warn("attachHandlersOnce: no element for", id);
      return;
    }

    // If it's a collection/array-like, attach to each item
    if (Array.isArray(btn) || (btn && typeof btn.forEach === "function" && btn.length)) {
      btn.forEach((item, idx) => {
        if (typeof item.onClick === "function") item.onClick(() => handleCardClick(i));
      });
      return;
    }

    if (typeof btn.onClick === "function") {
      btn.onClick(() => handleCardClick(i));
    } else {
      console.warn("attachHandlersOnce: element has no onClick()", id, btn);
    }
  });

  const newGameBtn = $w("#newGameBtn");
  if (newGameBtn && typeof newGameBtn.onClick === "function") {
    newGameBtn.onClick(() => startMemoryGame());
  }

  const resetBtn = $w("#resetBtn");
  if (resetBtn && typeof resetBtn.onClick === "function") {
    resetBtn.onClick(() => {
      resetGameState();
      startTimer();
    });
  }
}

$w.onReady(function () {
  attachHandlersOnce();
  startMemoryGame();
});

// ========================
// ANAGRAM GAME
// ========================

const words = ["CAT", "DOG", "SUN", "FISH", "HAT", "TREE", "BALL", "BOOK", "BIRD", "STAR",
  "APPLE", "HOUSE", "WATER", "MOTHER", "FATHER", "SISTER", "BROTHER", "FRIEND", "FAMILY", "PEOPLE",
  "SCHOOL", "ANIMAL", "HAPPY", "FUNNY", "LITTLE", "BECAUSE", "AROUND", "BEFORE", "TOGETHER", "AGAIN",
  "PRETTY", "BEAUTIFUL", "ENOUGH", "THROUGH", "THOUGH", "ALWAYS", "BETTER", "DIFFERENT", "REALLY", "SOMETHING",
  "GINGER", "WRITE", "LISTEN", "CLIMB"];

let currentWord = "";
let shuffledLetters = [];
let guess = "";

// Use only as many button IDs as on your page (adjust if you have fewer)
const anagramButtonIds = Array.from({ length: 8 }, (_, i) => `#anagramButton${i + 1}`);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setupButtons() {
  // Hide/clear all buttons first
  anagramButtonIds.forEach((btnId) => {
    const btn = select(btnId);
    if (!btn) return;
    if (Array.isArray(btn) || (btn && typeof btn.forEach === "function" && btn.length)) {
      btn.forEach(item => {
        if (item && typeof item.hide === "function") item.hide();
        if (item && "label" in item) item.label = "";
        if (item && typeof item.enable === "function") item.enable();
      });
      return;
    }
    if (typeof btn.hide === "function") btn.hide();
    if ("label" in btn) btn.label = "";
    if (typeof btn.enable === "function") btn.enable();
  });

  // Show only as many as letters
  shuffledLetters.forEach((letter, i) => {
    const btnId = anagramButtonIds[i];
    const btn = select(btnId);
    if (!btn) return;
    if (Array.isArray(btn) || (btn && typeof btn.forEach === "function" && btn.length)) {
      // handle collection by using first item
      const item = btn[0];
      if (!item) return;
      if ("label" in item) item.label = letter;
      if (typeof item.show === "function") item.show();
      if (typeof item.enable === "function") item.enable();
      return;
    }
    if ("label" in btn) btn.label = letter;
    if (typeof btn.show === "function") btn.show();
    if (typeof btn.enable === "function") btn.enable();
  });
}

function startAnagramGame(newWord) {
  if (newWord || !currentWord) {
    currentWord = words[Math.floor(Math.random() * words.length)];
  }

  shuffledLetters = shuffleArray(currentWord.split(""));

  // Reset UI
  guess = "";
  const guessEl = $w("#anagramGuess");
  if (guessEl) guessEl.text = "Your Guess: ";
  const msg = $w("#anagramMessage");
  if (msg && typeof msg.hide === "function") msg.hide();
  const scrambled = $w("#anagramScrambled");
  if (scrambled) scrambled.text = "Scrambled: " + shuffledLetters.join(" ");

  setupButtons();
}

function anagramHandleClick(index) {
  const btnId = anagramButtonIds[index];
  const btn = select(btnId);
  if (!btn) {
    console.warn("anagramHandleClick: no button for", btnId);
    return;
  }

  // pick element if collection
  const el = Array.isArray(btn) ? btn[0] : btn;
  const letter = ("label" in el) ? el.label : (el.text || "");
  guess += letter;
  const guessEl = $w("#anagramGuess");
  if (guessEl) guessEl.text = "Your Guess: " + guess;
  if (typeof el.disable === "function") el.disable();

  if (guess.length === currentWord.length) {
    const msg = $w("#anagramMessage");
    if (msg) {
      if (guess === currentWord) msg.text = `🎉 Correct! The word was ${currentWord}`;
      else msg.text = `❌ Wrong! It was ${currentWord}`;
      if (typeof msg.show === "function") msg.show();
    }
    // Optionally disable all buttons after guess complete
    anagramButtonIds.forEach((btnId) => {
      const b = select(btnId);
      const item = Array.isArray(b) ? b[0] : b;
      if (item && typeof item.disable === "function") item.disable();
    });
  }
}

$w.onReady(function () {
  // MEMORY: attach and start
  attachHandlersOnce();
  startMemoryGame();

  // ANAGRAM: start & attach handlers
  startAnagramGame(true);

  const anagramReset = $w("#anagramReset");
  if (anagramReset && typeof anagramReset.onClick === "function") {
    anagramReset.onClick(() => startAnagramGame(false));
  }

  const anagramNew = $w("#anagramNewGame");
  if (anagramNew && typeof anagramNew.onClick === "function") {
    anagramNew.onClick(() => startAnagramGame(true));
  }

  // Attach handlers ONCE for each anagram button
  anagramButtonIds.forEach((btnId, idx) => {
    const btn = select(btnId);
    if (!btn) {
      console.warn("No anagram button for", btnId);
      return;
    }
    const el = Array.isArray(btn) ? btn[0] : btn;
    if (el && typeof el.onClick === "function") {
      el.onClick(() => {
        if (!(el.disabled) && (el.label || el.text)) {
          anagramHandleClick(idx);
        }
      });
    }
  });
});
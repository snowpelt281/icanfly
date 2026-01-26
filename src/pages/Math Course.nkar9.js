// ========================================
// COMBINED MATH GAMES – WIX STUDIO
// All Games in One Application
// ========================================

// ----------------------
// ELEMENT HELPERS (SAFE)
// ----------------------

function setText(el, value) {
    if (el && "text" in el) {
        el.text = value;
    }
}

function getValue(el) {
    return el && "value" in el ? el.value : "";
}

// ----------------------
// GAME 1: MULTIPLICATION
// ----------------------

let selectedTable = 5;
let multiplicationAnswer = 0;

function newMultiplicationQuestion() {
    const multiplier = Math.floor(Math.random() * 12) + 1;
    multiplicationAnswer = selectedTable * multiplier;

    setText(
        $w("#multiplicationQuestion"),
        `${selectedTable} × ${multiplier} = ?`
    );

    $w("#multiplicationAnswer").value = "";
}

function checkMultiplication() {
    const userAnswer = parseInt(
        getValue($w("#multiplicationAnswer")),
        10
    );

    if (userAnswer === multiplicationAnswer) {
        setText($w("#multiplicationFeedback"), "✅ Excellent!");

        setTimeout(() => {
            setText($w("#multiplicationFeedback"), "");
            newMultiplicationQuestion();
        }, 1000);
    } else {
        setText(
            $w("#multiplicationFeedback"),
            `❌ Try again! (Answer: ${multiplicationAnswer})`
        );
    }
}

function changeTable() {
    selectedTable = parseInt($w("#tableSelector").value, 10);
    newMultiplicationQuestion();
}

// ----------------------
// GAME 2: NUMBER GUESS
// ----------------------

let randomNumber = 0;
let attempts = 0;
const maxAttempts = 10;

function newGuessingGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    setText(
        $w("#guessPrompt"),
        "I'm thinking of a number between 1 and 100!"
    );

    setText(
        $w("#guessAttempts"),
        `Attempts left: ${maxAttempts}`
    );

    $w("#guessInput").value = "";
    $w("#guessInput").show();
    $w("#makeGuess").show();
}

function makeGuess() {
    const guess = parseInt(
        getValue($w("#guessInput")),
        10
    );

    if (isNaN(guess)) {
        setText($w("#guessPrompt"), "Please enter a valid number!");
        return;
    }

    attempts++;

    if (guess === randomNumber) {
        setText(
            $w("#guessPrompt"),
            `🎉 Correct! The number was ${randomNumber} in ${attempts} tries!`
        );
        $w("#guessInput").hide();
        $w("#makeGuess").hide();
    } else if (attempts >= maxAttempts) {
        setText(
            $w("#guessPrompt"),
            `💀 Game over! The number was ${randomNumber}`
        );
        $w("#guessInput").hide();
        $w("#makeGuess").hide();
    } else {
        setText(
            $w("#guessPrompt"),
            guess < randomNumber ? "Too low 📉" : "Too high 📈"
        );
        setText(
            $w("#guessAttempts"),
            `Attempts left: ${maxAttempts - attempts}`
        );
    }

    $w("#guessInput").value = "";
}

// ----------------------
// GAME 3: SPEED MATH
// ----------------------

let timeLeft = 60;
let speedScore = 0;
let timer;
let gameRunning = false;
let currentAnswer = 0;

function generateSpeedQuestion() {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let n1, n2;

    if (op === "+") {
        n1 = Math.floor(Math.random() * 50) + 1;
        n2 = Math.floor(Math.random() * 50) + 1;
        currentAnswer = n1 + n2;
    } else if (op === "-") {
        n1 = Math.floor(Math.random() * 50) + 20;
        n2 = Math.floor(Math.random() * 20) + 1;
        currentAnswer = n1 - n2;
    } else {
        n1 = Math.floor(Math.random() * 12) + 1;
        n2 = Math.floor(Math.random() * 12) + 1;
        currentAnswer = n1 * n2;
    }

    setText(
        $w("#speedQuestion"),
        `${n1} ${op} ${n2} = ?`
    );

    $w("#speedAnswer").value = "";
}

function startSpeedGame() {
    gameRunning = true;
    timeLeft = 60;
    speedScore = 0;

    setText($w("#speedScore"), `Score: ${speedScore}`);
    setText($w("#timeLeft"), `Time: ${timeLeft}s`);

    $w("#speedStart").hide();
    $w("#speedSubmit").show();
    $w("#speedAnswer").show();

    generateSpeedQuestion();

    timer = setInterval(() => {
        timeLeft--;
        setText($w("#timeLeft"), `Time: ${timeLeft}s`);

        if (timeLeft <= 0) {
            endSpeedGame();
        }
    }, 1000);
}

function endSpeedGame() {
    gameRunning = false;
    clearInterval(timer);

    setText(
        $w("#speedQuestion"),
        `⏰ Time's up! Final score: ${speedScore}`
    );

    $w("#speedSubmit").hide();
    $w("#speedAnswer").hide();
    $w("#speedStart").show();
}

function submitSpeedAnswer() {
    if (!gameRunning) return;

    const answer = parseInt(
        getValue($w("#speedAnswer")),
        10
    );

    if (answer === currentAnswer) {
        speedScore++;
        setText($w("#speedScore"), `Score: ${speedScore}`);
    }

    generateSpeedQuestion();
}

// ----------------------
// GAME 4: EMOJI ADDITION
// ----------------------

let num1;
let num2;
let currentEmoji;
let score = 0;
let answered = false;

const emojiList = ["🍎", "🍌", "🍊", "🍇", "🍉", "🍓", "🍍"];

function makeEmoji(count, emoji) {
    return emoji.repeat(count);
}

function newProblem() {
    num1 = Math.floor(Math.random() * 9) + 1;  
    num2 = Math.floor(Math.random() * 9) + 1;
    currentEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    $w("#num1Text").text = makeEmoji(num1, currentEmoji);
    $w("#num2Text").text = makeEmoji(num2, currentEmoji);
    $w("#answerInput").value = "";
    $w("#feedbackText").text = "";
    answered = false;
}

function checkAnswer() {
    if (answered) return;

    const userValue = parseInt($w("#answerInput").value, 10);

    if (!isNaN(userValue) && userValue === num1 + num2) {
        score += 2;
        $w("#feedbackText").text = "✅ Correct!";
    } else {
        score = 0;
        $w("#feedbackText").text = "❌ Wrong. Score reset.";
    }

    $w("#scoreText").text = "Score: " + score;
    answered = true;
}

function showSlide() {
    $w("#section7").show();
    $w("#section5").hide();
}

// ----------------------
// ON READY
// ----------------------

$w.onReady(() => {
    console.log("✅ All math games loaded");

    // Start on emoji game (section5)
    $w("#section7").hide();
    $w("#section5").show();

    // Multiplication Game
    $w("#checkMultiplication").onClick(checkMultiplication);
    $w("#tableSelector").onChange(changeTable);

    // Guessing Game
    $w("#makeGuess").onClick(makeGuess);
    $w("#newGuessGame").onClick(newGuessingGame);

    // Speed Math Game
    $w("#speedStart").onClick(startSpeedGame);
    $w("#speedSubmit").onClick(submitSpeedAnswer);

    // Emoji Addition Game
    $w("#checkButton").onClick(() => checkAnswer());
    $w("#newButton").onClick(() => newProblem());
    $w("#button1").onClick(() => showSlide());

    // Initialize games
    newMultiplicationQuestion();
    newGuessingGame();
    newProblem();

    // Set initial UI states
    $w("#speedSubmit").hide();
    $w("#speedAnswer").hide();
    $w("#scoreText").text = "Score: 0";
});
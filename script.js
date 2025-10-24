// Game state
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let skipCount = 3;
let consultCount = 2;
let godMode = false;
let isPaused = true;

// Questions array (20 questions: 10 first-degree, 10 incomplete second-degree)
const questions = [
    // First-degree equations (ax + b = c)
    { question: "Resolva: 2x + 3 = 7", options: ["x = 2", "x = 3", "x = 4", "x = 1"], answer: "x = 2" },
    { question: "Resolva: 5x - 2 = 13", options: ["x = 3", "x = 2", "x = 4", "x = 5"], answer: "x = 3" },
    { question: "Resolva: 3x + 6 = 15", options: ["x = 3", "x = 5", "x = 4", "x = 2"], answer: "x = 3" },
    { question: "Resolva: 4x - 8 = 0", options: ["x = 2", "x = 0", "x = 4", "x = -2"], answer: "x = 2" },
    { question: "Resolva: 7x + 1 = 22", options: ["x = 3", "x = 4", "x = 2", "x = 5"], answer: "x = 3" },
    { question: "Resolva: 2x - 5 = 3", options: ["x = 4", "x = 2", "x = 3", "x = 5"], answer: "x = 4" },
    { question: "Resolva: 6x + 4 = 16", options: ["x = 2", "x = 3", "x = 1", "x = 4"], answer: "x = 2" },
    { question: "Resolva: 9x - 3 = 24", options: ["x = 3", "x = 2", "x = 4", "x = 5"], answer: "x = 3" },
    { question: "Resolva: 5x + 7 = 22", options: ["x = 3", "x = 4", "x = 2", "x = 5"], answer: "x = 3" },
    { question: "Resolva: 8x - 4 = 12", options: ["x = 2", "x = 3", "x = 1", "x = 4"], answer: "x = 2" },
    // Incomplete second-degree equations (ax² + c = 0 or ax² + bx = 0)
    { question: "Resolva: x² - 16 = 0", options: ["x = ±4", "x = ±2", "x = ±8", "x = 0"], answer: "x = ±4" },
    { question: "Resolva: 4x² - 36 = 0", options: ["x = ±3", "x = ±6", "x = ±2", "x = 0"], answer: "x = ±3" },
    { question: "Resolva: 2x² = 18", options: ["x = ±3", "x = ±2", "x = ±6", "x = 0"], answer: "x = ±3" },
    { question: "Resolva: x² + 25 = 0", options: ["x = ±5", "x = ±5i", "x = 0", "x = ±25"], answer: "x = ±5i" },
    { question: "Resolva: 3x² - 27 = 0", options: ["x = ±3", "x = ±9", "x = ±6", "x = 0"], answer: "x = ±3" },
    { question: "Resolva: x² = 49", options: ["x = ±7", "x = ±6", "x = ±8", "x = 0"], answer: "x = ±7" },
    { question: "Resolva: 5x² = 45", options: ["x = ±3", "x = ±9", "x = ±6", "x = 0"], answer: "x = ±3" },
    { question: "Resolva: x² + 9 = 0", options: ["x = ±3", "x = ±3i", "x = 0", "x = ±9"], answer: "x = ±3i" },
    { question: "Resolva: 2x² - 50 = 0", options: ["x = ±5", "x = ±10", "x = ±25", "x = 0"], answer: "x = ±5" },
    { question: "Resolva: 7x² = 28", options: ["x = ±2", "x = ±4", "x = ±7", "x = 0"], answer: "x = ±2" }
];

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score-value');
const currentQuestionElement = document.getElementById('current-question');
const timeLeftElement = document.getElementById('time-left');
const skipButton = document.getElementById('skip');
const consultButton = document.getElementById('consult');
const quitButton = document.getElementById('quit');
const godModeButton = document.getElementById('god-mode');
const nextButton = document.getElementById('next-button');
const finalScoreElement = document.getElementById('final-score');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');

// Start game
document.getElementById('start-button').addEventListener('click', startGame);
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadQuestion();
    isPaused = false;
    startTimer();
}

// Load question
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = '';
    q.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => selectOption(option));
        optionsElement.appendChild(button);
    });
    currentQuestionElement.textContent = currentQuestion + 1;
    document.getElementById('skip-count').textContent = skipCount;
    document.getElementById('consult-count').textContent = consultCount;
    timeLeft = 60;
    timeLeftElement.textContent = timeLeft;
    nextButton.classList.add('hidden');
    enableOptions();
}

// Timer
function startTimer() {
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timeLeftElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                disableOptions();
                nextButton.classList.remove('hidden');
                isPaused = true;
            }
        }
    }, 1000);
}

// Select option
function selectOption(selected) {
    if (isPaused) return;
    clearInterval(timer);
    isPaused = true;
    disableOptions();
    const correct = questions[currentQuestion].answer;
    const buttons = optionsElement.getElementsByTagName('button');
    for (let button of buttons) {
        if (button.textContent === correct) {
            button.classList.add('correct');
        }
        if (button.textContent === selected && selected !== correct && !godMode) {
            button.classList.add('incorrect');
        }
    }
    if (selected === correct && !godMode) {
        score += 100;
        scoreElement.textContent = score;
    }
    nextButton.classList.remove('hidden');
}

// Next question
nextButton.addEventListener('click', () => {
    currentQuestion++;
    isPaused = false;
    loadQuestion();
    startTimer();
});

// Help options
skipButton.addEventListener('click', () => {
    if (skipCount > 0 && !isPaused) {
        skipCount--;
        clearInterval(timer);
        currentQuestion++;
        loadQuestion();
        startTimer();
    }
});

consultButton.addEventListener('click', () => {
    if (consultCount > 0 && !isPaused) {
        consultCount--;
        alert(`Dica: Verifique os coeficientes e isole a variável. Resposta correta: ${questions[currentQuestion].answer}`);
        document.getElementById('consult-count').textContent = consultCount;
    }
});

quitButton.addEventListener('click', endGame);

godModeButton.addEventListener('click', () => {
    godMode = !godMode;
    godModeButton.textContent = godMode ? "Sair GOD MODE" : "GOD MODE";
    if (godMode) {
        alert(`GOD MODE ativado! Resposta correta: ${questions[currentQuestion].answer}`);
    }
});

// End game
function endGame() {
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

// Restart game
document.getElementById('restart-button').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    skipCount = 3;
    consultCount = 2;
    godMode = false;
    scoreElement.textContent = score;
    godModeButton.textContent = "GOD MODE";
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadQuestion();
    isPaused = false;
    startTimer();
});

// Music toggle
musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.textContent = "Desativar Música";
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = "Ativar Música";
    }
});

// Disable/enable options
function disableOptions() {
    const buttons = optionsElement.getElementsByTagName('button');
    for (let button of buttons) {
        button.disabled = true;
    }
}

function enableOptions() {
    const buttons = optionsElement.getElementsByTagName('button');
    for (let button of buttons) {
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
    }
}
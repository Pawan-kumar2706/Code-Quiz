const quizData = [
    {
        question: "What will `typeof NaN` return in JavaScript?",
        options: ["'number'", "'NaN'", "'undefined'", "'object'"],
        correct: 0,
        hint: "NaN is still treated as a type of numeric value.",
        reason: "`NaN` stands for 'Not-a-Number', but its type is actually 'number' in JavaScript."
    },
    {
        question: "Which method is used to serialize an object into a JSON string in JavaScript?",
        options: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.convert()"],
        correct: 1,
        hint: "It starts with `JSON.` and converts JS objects to JSON format.",
        reason: "`JSON.stringify()` converts a JavaScript object into a JSON-formatted string."
    },
    {
        question: "In Python, what will `print(0.1 + 0.2 == 0.3)` output?",
        options: ["True", "False", "0.3", "Error"],
        correct: 1,
        hint: "Floating point precision can cause surprising results.",
        reason: "Due to floating point arithmetic, `0.1 + 0.2` does not exactly equal `0.3`, so it returns `False`."
    },
    {
        question: "Which of the following is a mutable data type in Python?",
        options: ["tuple", "str", "list", "int"],
        correct: 2,
        hint: "It’s used often to store collections and can be changed.",
        reason: "`list` is mutable, meaning it can be modified after creation, unlike tuples and strings."
    },
    {
        question: "What does the 'this' keyword refer to in a regular JavaScript function (non-arrow)?",
        options: ["The global object", "The function itself", "The parent scope", "The DOM element"],
        correct: 0,
        hint: "It depends on how the function is called, but often refers to window in the global context.",
        reason: "In non-strict mode, 'this' inside a regular function refers to the global object (e.g., `window` in browsers)."
    },
    {
        question: "In C++, what is the default access specifier for members of a class?",
        options: ["public", "protected", "private", "internal"],
        correct: 2,
        hint: "Classes are more restrictive by default.",
        reason: "In C++, class members are `private` by default unless otherwise specified."
    },
    {
        question: "Which HTML element is used to define metadata about a document?",
        options: ["<meta>", "<head>", "<data>", "<info>"],
        correct: 0,
        hint: "It's often used in the <head> section for SEO or charset info.",
        reason: "`<meta>` tags provide metadata such as description, keywords, and author, but are not displayed on the page."
    },
    {
        question: "In Git, which command is used to create a new branch?",
        options: ["git new branch <name>", "git branch <name>", "git checkout <name>", "git init <name>"],
        correct: 1,
        hint: "It's a simple two-word command, no 'new'.",
        reason: "`git branch <branch-name>` is used to create a new branch without switching to it."
    }
];

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let usedQuestions = [];

const questionEl = document.getElementById('question');
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const timerEl = document.getElementById('timer');
const progressBar = document.querySelector('.progress-bar');
const quizContainer = document.getElementById('quiz');
const feedbackEl = document.getElementById('answer-feedback');
const hintBtn = document.getElementById('hint-btn');
const hintPopover = document.getElementById('hint-popover');
const hintText = document.getElementById('hint-text');
const closeHintBtn = document.getElementById('close-hint');

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';

    shuffledQuestions = [...quizData].sort(() => 0.5 - Math.random()); // shuffle questions
    currentQuestionIndex = 0;

    loadQuestion();
});

function getRandomQuestionIndex() {
    let index;
    do {
        index = Math.floor(Math.random() * quizData.length);
    } while (usedQuestions.includes(index) && usedQuestions.length < quizData.length);
    usedQuestions.push(index);
    return index;
}

function loadQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';
    feedbackEl.style.display = 'none';
    feedbackEl.className = 'answer-feedback';
    feedbackEl.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectOption(button, index));
        optionsEl.appendChild(button);
    });

    nextBtn.style.display = 'none';
    timeLeft = 30;
    if (timer) clearInterval(timer);
    startTimer();
    updateProgress();

    hintBtn.disabled = false;
    hintPopover.style.display = 'none';
}

hintBtn.addEventListener('click', () => {
    hintText.textContent = shuffledQuestions[currentQuestionIndex].hint;
    hintPopover.style.display = 'block';
    hintBtn.disabled = true;
});

closeHintBtn.addEventListener('click', () => {
    hintPopover.style.display = 'none';
});

function selectOption(selectedButton, optionIndex) {
    if (document.querySelector('.option.selected')) return;

    const buttons = optionsEl.getElementsByClassName('option');
    const question = shuffledQuestions[currentQuestionIndex];

    Array.from(buttons).forEach(btn => btn.disabled = true);

    selectedButton.classList.add('selected');

    if (optionIndex === question.correct) {
        selectedButton.classList.add('correct');
        score++;
        feedbackEl.innerHTML = `✅ Correct!<br><strong>Reason:</strong> ${question.reason}`;
        feedbackEl.classList.add('correct');
    } else {
        selectedButton.classList.add('incorrect');
        buttons[question.correct].classList.add('correct');
        feedbackEl.innerHTML = `❌ Incorrect!<br>The correct answer is: <strong>${question.options[question.correct]}</strong><br><strong>Reason:</strong> ${question.reason}`;
        feedbackEl.classList.add('incorrect');
    }

    feedbackEl.style.display = 'block';
    nextBtn.style.display = 'block';
    clearInterval(timer);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            checkAnswer();
        }
    }, 1000);
}

function checkAnswer() {
    const selected = document.querySelector('.option.selected');
    const question = shuffledQuestions[currentQuestionIndex];
    const buttons = optionsEl.getElementsByClassName('option');

    Array.from(buttons).forEach(btn => btn.disabled = true);

    if (selected) {
        const index = Array.from(buttons).indexOf(selected);
        if (index === question.correct) {
            selected.classList.add('correct');
            feedbackEl.innerHTML = `✅ Correct!<br><strong>Reason:</strong> ${question.reason}`;
            feedbackEl.classList.add('correct');
            score++;
        } else {
            selected.classList.add('incorrect');
            buttons[question.correct].classList.add('correct');
            feedbackEl.innerHTML = `❌ Incorrect!<br>The correct answer is: <strong>${question.options[question.correct]}</strong><br><strong>Reason:</strong> ${question.reason}`;
            feedbackEl.classList.add('incorrect');
        }
    } else {
        buttons[question.correct].classList.add('correct');
        feedbackEl.innerHTML = `⏰ Time's up!<br>The correct answer is: <strong>${question.options[question.correct]}</strong><br><strong>Reason:</strong> ${question.reason}`;
        feedbackEl.classList.add('incorrect');
    }

    feedbackEl.style.display = 'block';
    nextBtn.style.display = 'block';
}

function updateProgress() {
    const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
}

function showResults() {
    quizContainer.innerHTML = `
        <div class="results">
            <div class="result-icon">
                <i class="fas ${score > quizData.length / 2 ? 'fa-trophy text-success' : 'fa-times-circle text-danger'}"></i>
            </div>
            <div class="score">Your score: ${score}/${quizData.length}</div>
            <p>${score > quizData.length / 2 ? 'Great job!' : 'Better luck next time!'}</p>
            <button class="btn-primary" onclick="location.reload()">Restart Quiz</button>
        </div>
    `;
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});


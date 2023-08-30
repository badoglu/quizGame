import { questionsList } from "./questionsList.js";

const questionText = document.getElementById("questionText");
const startQuizBtn = document.getElementById("startBtn");
const highestScoreBtn = document.getElementById("highestScoreBtn");
const highestScoreText = document.getElementById("highestScoreText");
const optionButtons = document.getElementById("optionButtons");
const questionsContainer = document.getElementById("questionsContainer");
const resultContainer = document.getElementById("result-container");
const scoreText = document.getElementById("score");
const timerContainer = document.getElementById("timerContainer");

let currentQuestionIndex = 0;
let timeLeft = 120;
let isQuizEnded = false;

function saveHighestScoreToLocalStorage(timeScore) {
  const highestScore = localStorage.getItem("highestScore");

  if (!highestScore) {
    localStorage.setItem("highestScore", timeScore);
  } else {
    if (timeScore > Number(highestScore)) {
      localStorage.setItem("highestScore", timeScore);
    }
  }
}

highestScoreBtn.addEventListener("click", function () {
  highestScoreText.textContent =
    localStorage.getItem("highestScore") || "No Data";
  highestScoreText.classList.remove("unvisible");

  setTimeout(() => {
    highestScoreText.classList.add("unvisible");
  }, 3000);
});

startQuizBtn.addEventListener("click", function () {
  if (isQuizEnded) {
    currentQuestionIndex = 0;
    timeLeft = 120;
    isQuizEnded = false;
  }

  highestScoreText.classList.add("unvisible");
  resultContainer.classList.add("unvisible");
  startQuizBtn.style.display = "none";
  questionsContainer.classList.remove("unvisible");
  setNextQuestion();
  startTimer();
});

function startTimer() {
  const timerInterval = setInterval(() => {
    if (isQuizEnded) {
      clearInterval(timerInterval);
      return;
    }

    if (timeLeft > 0) {
      timeLeft--;
      timerContainer.textContent = timeLeft;
    } else {
      clearInterval(timerInterval);
      showResults();
    }
  }, 1000);
}

function showQuestions(question) {
  questionText.textContent = `${currentQuestionIndex + 1}) ${
    question.questionTitle
  }`;

  question.options.forEach(option => {
    const optionBtn = document.createElement("button");
    optionBtn.setAttribute("data-value", option);

    optionBtn.textContent = option;
    optionBtn.classList.add("optionBtn");
    optionBtn.addEventListener("click", () =>
      selectAnswer(option, question.correctAnswer)
    );

    optionButtons.appendChild(optionBtn);
  });
}

function selectAnswer(selectedOption, correctAnswer) {
  const selectedOptionBtn = optionButtons.querySelector(
    `[data-value="${selectedOption}"]`
  );

  if (selectedOption === correctAnswer) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsList.length) {
      setNextQuestion();
    } else {
      showResults();
    }
  } else {
    timeLeft -= 10;
    optionButtons.removeChild(selectedOptionBtn);
  }
}

function setNextQuestion() {
  optionButtons.innerHTML = "";
  showQuestions(questionsList[currentQuestionIndex]);
}

function showResults() {
  isQuizEnded = true;
  saveHighestScoreToLocalStorage(timeLeft);
  questionsContainer.classList.add("unvisible");
  resultContainer.classList.remove("unvisible");
  timerContainer.textContent = 120;
  scoreText.textContent = `Your Score: ${timeLeft < 0 ? 0 : timeLeft} seconds`;
  startQuizBtn.textContent = "Play Again";
  startQuizBtn.style.display = "inline";
}

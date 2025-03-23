const questions = [];
for (let i = 1; i <= 60; i++) {
  questions.push({
    question: `Pergunta ${i}: Qual é a resposta correta?`,
    options: ["Opção A", "Opção B", "Opção C", "Opção D"],
    answer: Math.floor(Math.random() * 4),
  });
}

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("time");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const restartButton = document.getElementById("restart-button");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    end
::contentReference[oaicite:0]{index=0}
 

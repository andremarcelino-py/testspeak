const allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student", "I am student", "I student am", "A student I am"], answer: 0 },
  { question: "Which one is correct?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], answer: 0 },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 0 }
];

// Função para embaralhar as perguntas e selecionar 5 aleatórias
function getRandomQuestions() {
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

let questions = getRandomQuestions();
let score = 0;
let currentQuestion = 0;
let errors = [];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");

function loadQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";
    
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.onclick = () => checkAnswer(index);
      optionsElement.appendChild(li);
    });
  } else {
    endQuiz();
  }
}

function checkAnswer(selected) {
  const q = questions[currentQuestion];
  const options = optionsElement.getElementsByTagName("li");

  for (let i = 0; i < options.length; i++) {
    options[i].style.backgroundColor = i === q.answer ? "green" : (i === selected ? "red" : "#9B59B6");
    options[i].style.pointerEvents = "none";
  }

  if (selected === q.answer) {
    score++;
    updateScore();
  } else {
    errors.push(`Q: ${q.question} - R: ${q.options[q.answer]}`);
  }

  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1000);
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

function endQuiz() {
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação: ${score}/10`;

  errorListElement.innerHTML = errors
    .map(err => `<li class="error-item">${err}</li>`)
    .join("");
}

restartButton.onclick = () => {
  score = 0;
  currentQuestion = 0;
  errors = [];
  questions = getRandomQuestions();
  quizContainer.style.display = "block";
  endScreen.style.display = "none";
  loadQuestion();
};

document.getElementById("quizTab").onclick = () => {
  quizContainer.style.display = "block";
  document.getElementById("library-container").style.display = "none";
  endScreen.style.display = "none";
  questions = getRandomQuestions();
  loadQuestion();
};

document.getElementById("libraryTab").onclick = () => {
  document.getElementById("library-container").style.display = "block";
  quizContainer.style.display = "none";
  endScreen.style.display = "none";
};

loadQuestion();
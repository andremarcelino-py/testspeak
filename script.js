import { db } from "./firebase-config.js";
import { collection, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

let userId = null;
let score = 0;
let currentQuestion = 0;
let errors = [];

// Cadastro do usuário
document.getElementById("start-button").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

  if (name && number) {
    try {
      const docRef = await addDoc(collection(db, "users"), { name, number, score: 0 });
      userId = docRef.id; // Salvar o ID do usuário para atualizar depois

      document.getElementById("register-container").style.display = "none";
      document.getElementById("main-container").style.display = "block";
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

// Função para atualizar pontuação no Firestore
async function updateUserScore() {
  if (userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { score: score });
      console.log("Pontuação salva no Firestore!");
    } catch (error) {
      console.error("Erro ao salvar a pontuação:", error);
    }
  }
}

// Banco de perguntas
const allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student", "I am student", "I student am", "A student I am"], answer: 0 },
  { question: "Which one is correct?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], answer: 0 },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 0 },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], answer: 1 },
];

function getRandomQuestions() {
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

let questions = getRandomQuestions();

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");

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

async function endQuiz() {
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação: ${score}/10`;

  errorListElement.innerHTML = errors.map(err => `<li class="error-item">${err}</li>`).join("");

  await updateUserScore();
}

document.getElementById("restart-button").onclick = () => {
  score = 0;
  currentQuestion = 0;
  errors = [];
  questions = getRandomQuestions();
  quizContainer.style.display = "block";
  endScreen.style.display = "none";
  loadQuestion();
};

loadQuestion();
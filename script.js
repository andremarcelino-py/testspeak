import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";  
import { getFirestore, collection, addDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";  

const firebaseConfig = {  
  apiKey: "AIzaSyBCVGQk1Ctp1IZJrHQdM6YUSItaD3pypjg",  
  authDomain: "testspeakeasy.firebaseapp.com",  
  projectId: "testspeakeasy",  
  storageBucket: "testspeakeasy.appspot.com",  
  messagingSenderId: "732379388945",  
  appId: "1:732379388945:web:a46304dd51b10e2850e5b0",  
  measurementId: "G-WNB4XS2YJB"  
};  

const app = initializeApp(firebaseConfig);  
const db = getFirestore(app);

// Elementos da interface
const registerContainer = document.getElementById("register-container");
const menuContainer = document.getElementById("menu-container");
const quizContainer = document.getElementById("quiz-container");
const perguntasContainer = document.getElementById("perguntas-container");
const libraryContainer = document.getElementById("library-container");
const rankingContainer = document.getElementById("ranking-container");
const endScreen = document.getElementById("end-screen");

const startButton = document.getElementById("start-button");
const btnQuiz = document.getElementById("btnQuiz");
const btnPerguntas = document.getElementById("btnPerguntas");
const btnLibrary = document.getElementById("btnLibrary");
const btnRanking = document.getElementById("btnRanking");

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");
const rankingList = document.getElementById("ranking-list");

// Variáveis para o Quiz
let allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student", "I am student", "I student am", "A student I am"], answer: 0 },
  { question: "Which one is correct?", options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], answer: 0 },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 0 },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], answer: 1 },
  { question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], answer: 1 },
  { question: "What does 'She is my sister' mean?", options: ["Ela é minha irmã", "Ela é minha prima", "Ela é minha mãe", "Ela é minha amiga"], answer: 0 },
  { question: "Which sentence is correct?", options: ["He have a car", "He has a car", "He are a car", "He do have car"], answer: 1 },
  { question: "How do you say 'Eu gosto de ler livros' in English?", options: ["I like to read books", "I likes to read books", "I am like to read books", "I reading books"], answer: 0 },
  { question: "What is 'yesterday' in Portuguese?", options: ["Amanhã", "Ontem", "Hoje", "Depois"], answer: 1 },
  { question: "Which one is correct?", options: ["She don't like coffee", "She doesn't like coffee", "She not like coffee", "She no like coffee"], answer: 1 },
  { question: "Translate: 'They are my friends'", options: ["Eles são meus amigos", "Eles foram meus amigos", "Eles estavam meus amigos", "Eles é meus amigos"], answer: 0 },
  { question: "What does 'goodbye' mean?", options: ["Olá", "Obrigado", "Adeus", "Por favor"], answer: 2 },
  { question: "What is the opposite of 'cold'?", options: ["Hot", "Warm", "Cool", "Frozen"], answer: 0 },
  { question: "Choose the correct sentence", options: ["She go to school", "She goes to school", "She going to school", "She is go to school"], answer: 1 },
  { question: "How do you say 'Nós estamos felizes' in English?", options: ["We is happy", "We are happy", "We am happy", "We do happy"], answer: 1 }
];
let questions = [];
let score = 0;
let currentQuestion = 0;
let errors = [];
let quizTimer = 0;
let timerInterval;

// Função para embaralhar e pegar 15 perguntas
function getRandomQuestions() {
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 15);
}

// Inicia o timer do quiz
function startTimer() {
  quizTimer = 0;
  timerElement.textContent = quizTimer;
  timerInterval = setInterval(() => {
    quizTimer++;
    timerElement.textContent = quizTimer;
  }, 1000);
}

// Para o timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Carrega a pergunta atual
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
    options[i].classList.remove("correct", "wrong");
    if (i === q.answer) {
      options[i].classList.add("correct");
    } else if (i === selected) {
      options[i].classList.add("wrong");
    }
    options[i].style.pointerEvents = "none";
  }
  
  if (selected === q.answer) {
    score++;
    updateScore();
  } else {
    errors.push(`Pergunta: ${q.question} - Resposta correta: ${q.options[q.answer]}`);
  }
  
  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1500);
}

function updateScore() {
  scoreElement.textContent = score;
}

function endQuiz() {
  stopTimer();
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação Final: ${score}/15 | Tempo: ${quizTimer}s`;
  errorListElement.innerHTML = errors.map(err => `<li class="error-item">${err}</li>`).join("");
  // Salva pontuação e tempo para o ranking
  const userName = document.getElementById("name").value;
  saveScore(userName, score, quizTimer);
}

restartButton.onclick = () => {
  score = 0;
  currentQuestion = 0;
  errors = [];
  questions = getRandomQuestions();
  endScreen.style.display = "none";
  quizContainer.style.display = "block";
  updateScore();
  startTimer();
  loadQuestion();
};

// Salva pontuação e tempo no Firestore
async function saveScore(userName, score, time) {
  const querySnapshot = await getDocs(collection(db, "users"));
  let userDoc;
  querySnapshot.forEach((doc) => {
    if (doc.data().name === userName) {
      userDoc = doc.ref;
    }
  });
  if (userDoc) {
    await updateDoc(userDoc, { score, time });
  }
}

// Função para esconder todas as seções
function hideAllSections() {
  quizContainer.style.display = "none";
  perguntasContainer.style.display = "none";
  libraryContainer.style.display = "none";
  rankingContainer.style.display = "none";
  endScreen.style.display = "none";
  menuContainer.style.display = "none";
}

// Eventos de menu
btnQuiz.onclick = () => {
  hideAllSections();
  quizContainer.style.display = "block";
  questions = getRandomQuestions();
  score = 0;
  currentQuestion = 0;
  errors = [];
  updateScore();
  startTimer();
  loadQuestion();
};

btnPerguntas.onclick = () => {
  hideAllSections();
  perguntasContainer.style.display = "block";
};

btnLibrary.onclick = () => {
  hideAllSections();
  libraryContainer.style.display = "block";
};

btnRanking.onclick = async () => {
  hideAllSections();
  rankingContainer.style.display = "block";
  rankingList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "users"));
  let users = [];
  querySnapshot.forEach(doc => {
    let userData = doc.data();
    users.push({ name: userData.name, score: userData.score || 0, time: userData.time || 9999 });
  });
  // Ordena por score decrescente; em caso de empate, menor tempo vence
  users.sort((a, b) => {
    if(a.score === b.score) {
      return a.time - b.time;
    }
    return b.score - a.score;
  });
  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.className = "animate-in";
    li.style.animationDelay = `${index * 0.1}s`;
    li.innerHTML = `<span>${index + 1}. ${user.name}</span><span>Pontos: ${user.score} | Tempo: ${user.time}s</span>`;
    rankingList.appendChild(li);
  });
};

// Lógica de cadastro – após cadastro, mostra o menu principal
startButton.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;
  if (name && number) {
    try {
      await addDoc(collection(db, "users"), { name, number });
      registerContainer.style.display = "none";
      menuContainer.style.display = "block";
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

// Lógica para expandir/retrair os temas de Perguntas
document.querySelectorAll('.tema-titulo').forEach(titulo => {
  titulo.addEventListener('click', () => {
    const conteudo = titulo.nextElementSibling;
    if (conteudo.style.display === "none" || conteudo.style.display === "") {
      conteudo.style.display = "block";
    } else {
      conteudo.style.display = "none";
    }
  });
});

// Função para tratar respostas nos temas (exibe uma mensagem explicativa)
window.responderTema = function (element, correta, mensagem) {
  alert(mensagem);
  // Opcional: marcar a resposta escolhida ou desabilitar opções
};
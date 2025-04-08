Segue abaixo o código completo, com todas as linhas originais e as correções realizadas para usar apenas o Firestore – removendo as funções do Realtime Database – e com as alterações marcadas com comentários iniciados por "/* NOVA ALTERAÇÃO */". Ao final, o arquivo foi compactado em ZIP para download.

----------------- script.js -----------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";  
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, getDoc, doc 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";  

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

// Removido uso do Realtime Database e funções (push, ref, get, etc.)

// Recupera ou aguarda a criação do usuário via cadastro
let userId = localStorage.getItem("userId");
// Se o usuário não estiver cadastrado, a criação ocorrerá na lógica de cadastro abaixo

// Elementos da interface
const registerContainer = document.getElementById("register-container");
const menuContainer = document.getElementById("menu-container");
const quizContainer = document.getElementById("quiz-container");
const perguntasContainer = document.getElementById("perguntas-container");
const perguntasQuizContainer = document.getElementById("perguntas-quiz-container");
const libraryContainer = document.getElementById("library-container");
const rankingContainer = document.getElementById("ranking-container");
const endScreen = document.getElementById("end-screen");
const perguntasEndScreen = document.getElementById("perguntas-end-screen");

// Botões
const startButton = document.getElementById("start-button"); // Botão de cadastro
const btnQuiz = document.getElementById("btnQuiz");
const btnPerguntas = document.getElementById("btnPerguntas");
const btnLibrary = document.getElementById("btnLibrary");
const btnRanking = document.getElementById("btnRanking");
const btnFacil = document.getElementById("btnFacil");
const btnMedio = document.getElementById("btnMedio");
const btnDificil = document.getElementById("btnDificil");
const restartButton = document.getElementById("restart-button");
const perguntasRestartButton = document.getElementById("perguntas-restart-button");
const perguntasMenuButton = document.getElementById("perguntas-menu-button");

// Elementos do quiz principal
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const rankingList = document.getElementById("ranking-list");

// Elementos do quiz de perguntas
const perguntasQuestionElement = document.getElementById("perguntas-question");
const perguntasOptionsElement = document.getElementById("perguntas-options");
const perguntasScoreElement = document.getElementById("perguntas-score");
const perguntasTimerElement = document.getElementById("perguntas-timer");
const perguntasFinalMessageElement = document.getElementById("perguntas-final-message");
const perguntasErrorListElement = document.getElementById("perguntas-error-list");

// Botões de voltar
const backButtons = {
  quiz: document.getElementById("backButtonQuiz"),
  perguntas: document.getElementById("backButtonPerguntas"),
  perguntasQuiz: document.getElementById("backButtonPerguntasQuiz"),
  library: document.getElementById("backButtonLibrary"),
  ranking: document.getElementById("backButtonRanking"),
  endScreen: document.getElementById("backButtonEndScreen"),
  perguntasEndScreen: document.getElementById("backButtonPerguntasEndScreen")
};

// Configuração dos eventos dos botões de voltar
Object.values(backButtons).forEach(button => {
  if (button) {
    button.addEventListener('click', backToMenu);
  }
});

// Função para voltar ao menu (garante que os timers sejam parados)
function backToMenu() {
  stopTimer();
  stopPerguntasTimer();
  hideAllSections();
  menuContainer.style.display = "block";
}

function hideAllSections() {
  const sections = [
    registerContainer,
    quizContainer,
    perguntasContainer,
    perguntasQuizContainer,
    libraryContainer,
    rankingContainer,
    endScreen,
    perguntasEndScreen
  ];
  
  sections.forEach(section => {
    if (section) section.style.display = "none";
  });
}

// Perguntas do quiz (mais perguntas adicionadas)
let allQuestions = [
  { 
    question: "What is 'eu sou estudante' in English?", 
    options: ["I am a student", "I am student", "I student am", "A student I am"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "Which one is correct?", 
    options: ["Do you like pizza?", "Like pizza you?", "Pizza do you like?", "You pizza like?"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "frases-basicas"
  },
  { 
    question: "What does 'I am learning English' mean?", 
    options: ["Eu estou aprendendo inglês", "Eu aprendi inglês", "Eu ensino inglês", "Eu amo inglês"], 
    answer: 0,
    difficulty: "medium",
    libraryRef: "frases-basicas"
  },
  { 
    question: "How do you say 'Onde você mora?' in English?", 
    options: ["Where are you living?", "Where do you live?", "Where is you live?", "Where you live?"], 
    answer: 1,
    difficulty: "medium",
    libraryRef: "frases-basicas"
  },
  { 
    question: "What is the plural of 'child'?", 
    options: ["Childs", "Children", "Childes", "Childern"], 
    answer: 1,
    difficulty: "hard",
    libraryRef: "verbos"
  },
  // Novas perguntas adicionadas:
  { 
    question: "How do you say 'bom dia' in English?", 
    options: ["Good morning", "Good evening", "Good night", "Hello"], 
    answer: 0,
    difficulty: "easy",
    libraryRef: "greetings"
  },
  {
    question: "What is the past tense of 'go'?",
    options: ["Go", "Went", "Gone", "Going"],
    answer: 1,
    difficulty: "easy",
    libraryRef: "verbos"
  },
  {
    question: "Which sentence is correct?",
    options: ["He don't like apples", "He doesn't like apples", "He like apples", "He doesn't likes apples"],
    answer: 1,
    difficulty: "medium",
    libraryRef: "grammar"
  },
  {
    question: "What does 'break a leg' mean?",
    options: ["Good luck", "Break your leg", "Run fast", "Don't trip"],
    answer: 0,
    difficulty: "medium",
    libraryRef: "idioms"
  }
];

let questions = [];
let perguntasQuestions = [];
let score = 0;
let perguntasScore = 0;
let currentQuestion = 0;
let currentPerguntaQuestion = 0;
let errors = [];
let perguntasErrors = [];
let quizTimer = 0;
let perguntasTimer = 0;
let timerInterval;
let perguntasTimerInterval;

// Funções do Quiz Principal
function getRandomQuestions() {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 15);
}

function startTimer() {
  quizTimer = 0;
  timerElement.textContent = quizTimer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    quizTimer++;
    timerElement.textContent = quizTimer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function loadQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.addEventListener('click', () => checkAnswer(index));
      optionsElement.appendChild(li);
    });
  } else {
    endQuiz();
  }
}

function checkAnswer(selected) {
  const q = questions[currentQuestion];
  const options = optionsElement.querySelectorAll('li');
  
  options.forEach((option, index) => {
    option.classList.remove("correct", "wrong");
    if (index === q.answer) {
      option.classList.add("correct");
    } else if (index === selected) {
      option.classList.add("wrong");
    }
    option.style.pointerEvents = "none";
  });
  
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

async function endQuiz() {
  stopTimer();
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação Final: ${score}/15 | Tempo: ${quizTimer}s`;
  errorListElement.innerHTML = errors.map(err => `<li class="error-item">${err}</li>`).join("");
  
  localStorage.setItem("quizCompleted", "true");  /* NOVA ALTERAÇÃO: Armazena a conclusão do quiz no localStorage */
  
  if (userId) {  /* NOVA ALTERAÇÃO: Atualiza o documento do usuário no Firestore */
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      score: score,
      completed: true,
      time: quizTimer,
      timestamp: Date.now()
    });
  }
}

// Funções do Quiz de Perguntas
function startPerguntasTimer() {
  perguntasTimer = 0;
  perguntasTimerElement.textContent = perguntasTimer;
  clearInterval(perguntasTimerInterval);
  perguntasTimerInterval = setInterval(() => {
    perguntasTimer++;
    perguntasTimerElement.textContent = perguntasTimer;
  }, 1000);
}

function stopPerguntasTimer() {
  clearInterval(perguntasTimerInterval);
}

function loadPerguntasQuestion() {
  if (currentPerguntaQuestion < perguntasQuestions.length) {
    const q = perguntasQuestions[currentPerguntaQuestion];
    perguntasQuestionElement.textContent = q.question;
    perguntasOptionsElement.innerHTML = "";
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.addEventListener('click', () => checkPerguntasAnswer(index));
      perguntasOptionsElement.appendChild(li);
    });
  } else {
    endPerguntasQuiz();
  }
}

function checkPerguntasAnswer(selected) {
  const q = perguntasQuestions[currentPerguntaQuestion];
  const options = perguntasOptionsElement.querySelectorAll('li');
  
  options.forEach((option, index) => {
    option.classList.remove("correct", "wrong");
    if (index === q.answer) {
      option.classList.add("correct");
    } else if (index === selected) {
      option.classList.add("wrong");
    }
    option.style.pointerEvents = "none";
  });
  
  if (selected === q.answer) {
    perguntasScore++;
    updatePerguntasScore();
  } else {
    perguntasErrors.push({
      question: q.question,
      correct: q.options[q.answer],
      libraryRef: q.libraryRef
    });
  }
  
  setTimeout(() => {
    currentPerguntaQuestion++;
    loadPerguntasQuestion();
  }, 1500);
}

function updatePerguntasScore() {
  perguntasScoreElement.textContent = perguntasScore;
}

function endPerguntasQuiz() {
  stopPerguntasTimer();
  perguntasQuizContainer.style.display = "none";
  perguntasEndScreen.style.display = "block";
  perguntasFinalMessageElement.textContent = `Pontuação Final: ${perguntasScore}/10 | Tempo: ${perguntasTimer}s`;
  
  perguntasErrorListElement.innerHTML = perguntasErrors.map(err => `
    <li class="error-item">
      ${err.question}<br>
      Resposta correta: ${err.correct}
      <button onclick="showLibrarySection('${err.libraryRef}')">Aprenda Mais</button>
    </li>
  `).join("");
}

// Chamada para verificação de conclusão do quiz usando Firestore
async function checkQuizCompletion() {
  if (localStorage.getItem("quizCompleted") === "true") {  /* NOVA ALTERAÇÃO: Verifica também no localStorage */
    quizContainer.innerHTML = "<h3>Você já completou o quiz.</h3>";
    btnQuiz.disabled = true; /* Usa o botão de iniciar quiz para bloquear início */
    return;
  }
  if (userId) {
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists() && userSnap.data().completed) {
      quizContainer.innerHTML = "<h3>Você já completou o quiz.</h3>";
      btnQuiz.disabled = true;
    }
  }
}

// Lógica de cadastro
startButton.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;
  if (name && number) {
    try {
      const docRef = await addDoc(collection(db, "users"), { name, number });
      localStorage.setItem("userId", docRef.id);  /* NOVA ALTERAÇÃO: Salva o ID do usuário no localStorage */
      registerContainer.style.display = "none";
      menuContainer.style.display = "block";
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

// Salva pontuação e tempo no Firestore para o quiz principal (essa função pode ser usada se desejar atualizar o score via nome)
// Mantida, mas o fluxo principal agora usa o updateDoc no endQuiz
async function saveScore(userName, score, time) {
  const querySnapshot = await getDocs(collection(db, "users"));
  let userDocRef;
  querySnapshot.forEach((docSnap) => {
    if (docSnap.data().name === userName) {
      userDocRef = docSnap.ref;
    }
  });
  if (userDocRef) {
    await updateDoc(userDocRef, { score, time });
  }
}

// Inicia o Quiz de Perguntas por nível
function startPerguntasQuiz(difficulty) {
  perguntasQuestions = allQuestions
    .filter(q => q.difficulty === difficulty)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  
  perguntasScore = 0;
  currentPerguntaQuestion = 0;
  perguntasErrors = [];
  updatePerguntasScore();
  
  hideAllSections();
  perguntasQuizContainer.style.display = "block";
  startPerguntasTimer();
  loadPerguntasQuestion();
}

// Event Listeners para navegação e início dos quizzes

btnQuiz.addEventListener('click', async () => {
  await checkQuizCompletion();
  if (btnQuiz.disabled) return; /* Se o quiz já foi concluído, não inicia */
  hideAllSections();
  quizContainer.style.display = "block";
  questions = getRandomQuestions();
  score = 0;
  currentQuestion = 0;
  errors = [];
  updateScore();
  startTimer();
  loadQuestion();
});

btnPerguntas.addEventListener('click', () => {
  hideAllSections();
  perguntasContainer.style.display = "block";
});

btnFacil.addEventListener('click', () => startPerguntasQuiz('easy'));
btnMedio.addEventListener('click', () => startPerguntasQuiz('medium'));
btnDificil.addEventListener('click', () => startPerguntasQuiz('hard'));

btnLibrary.addEventListener('click', () => {
  hideAllSections();
  libraryContainer.style.display = "block";
});

btnRanking.addEventListener('click', async () => {
  hideAllSections();
  rankingContainer.style.display = "block";
  rankingList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "users"));
  let users = [];
  querySnapshot.forEach(docSnap => {
    let userData = docSnap.data();
    users.push({ name: userData.name, score: userData.score || 0, time: userData.time || 9999 });
  });
  
  users = users.filter(user => user.time !== 9999);
  
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
});

// Exibe a seção da biblioteca conforme a referência
window.showLibrarySection = function(sectionId) {
  hideAllSections();
  libraryContainer.style.display = "block";
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
};


---

O arquivo ZIP com o código completo (script.js) já foi gerado e pode ser baixado através do link abaixo:

Download quiz_project.zip

Caso precise de mais alguma alteração ou esclarecimento, estou à disposição!


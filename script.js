import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";  
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  getDoc
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

// Variáveis globais
let timer;
let timeLeft = 60;
let isQuizActive = false;
let questions = [];
let score = 0;
let currentQuestion = 0;
let errors = [];

// Elementos DOM
const elements = {
  question: document.getElementById("question"),
  options: document.getElementById("options"),
  quizContainer: document.getElementById("quiz-container"),
  endScreen: document.getElementById("end-screen"),
  finalMessage: document.getElementById("final-message"),
  errorList: document.getElementById("error-list"),
  restartButton: document.getElementById("restart-button"),
  progressBar: document.querySelector(".progress"),
  timerContainer: document.getElementById("timer-container"),
  timer: document.getElementById("timer"),
  score: document.getElementById("score"),
  registerButton: document.getElementById("register-button"),
  startQuizButton: document.getElementById("start-quiz-button"),
  feedbackText: document.getElementById("feedback-text"),
  submitFeedback: document.getElementById("submit-feedback"),
  registerContainer: document.getElementById("register-container"),
  mainContainer: document.getElementById("main-container"),
  libraryContainer: document.getElementById("library-container"),
  rankingContainer: document.getElementById("ranking-container"),
  feedbackContainer: document.getElementById("feedback-container"),
  quizTab: document.getElementById("quizTab"),
  libraryTab: document.getElementById("libraryTab"),
  rankingTab: document.getElementById("rankingTab"),
  feedbackTab: document.getElementById("feedbackTab")
};

// Array completo de perguntas
const allQuestions = [
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
  { question: "How do you say 'Nós estamos felizes' in English?", options: ["We is happy", "We are happy", "We am happy", "We do happy"], answer: 1 },
  { question: "What is the past of 'eat'?", options: ["Ate", "Eaten", "Eating", "Eats"], answer: 0 },
  { question: "What is 'verde' in English?", options: ["Red", "Blue", "Green", "Yellow"], answer: 2 },
  { question: "Which is correct?", options: ["She have a dog", "She has a dog", "She do has a dog", "She has dog"], answer: 1 },
  { question: "How do you say 'Me ajuda, por favor' in English?", options: ["Help me, please", "Please me help", "Me help please", "Please, I need help"], answer: 0 },
  { question: "What does 'tired' mean?", options: ["Feliz", "Cansado", "Bravo", "Triste"], answer: 1 }
];

// Funções principais
function getRandomQuestions() {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

function loadQuestion() {
  const progress = (currentQuestion / questions.length) * 100;
  elements.progressBar.style.width = `${progress}%`;
  
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    elements.question.textContent = q.question;
    elements.options.innerHTML = "";
    
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.addEventListener("click", () => checkAnswer(index));
      elements.options.appendChild(li);
    });
  } else {
    endQuiz();
  }
}

function checkAnswer(selected) {
  if (!isQuizActive) return;

  const q = questions[currentQuestion];
  const options = elements.options.children;

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
    if (currentQuestion >= questions.length) {
      questions = getRandomQuestions();
      currentQuestion = 0;
    }
    loadQuestion();
  }, 1500);
}

function updateScore() {
  elements.score.textContent = score;
}

function endQuiz() {
  isQuizActive = false;
  clearInterval(timer);
  elements.timerContainer.classList.add("hidden");
  
  elements.quizContainer.classList.add("hidden");
  elements.endScreen.classList.remove("hidden");
  elements.finalMessage.textContent = `Pontuação Final: ${score} pontos`;

  elements.errorList.innerHTML = errors
    .map(err => `<li class="error-item">${err}</li>`)
    .join("");
    
  const userName = document.getElementById("name").value;
  saveScore(userName, score);
}

async function saveScore(userName, score) {
  const querySnapshot = await getDocs(collection(db, "users"));
  let userDoc;

  querySnapshot.forEach((doc) => {
    if (doc.data().name === userName) {
      userDoc = doc.ref;
    }
  });

  if (userDoc) {
    const userData = (await getDoc(userDoc)).data();
    await updateDoc(userDoc, {
      score: userData.score + score,
      totalCorrect: userData.totalCorrect + score,
      totalQuestions: userData.totalQuestions + currentQuestion,
      lastPlayed: new Date()
    });
  }
}

function startQuiz() {
  isQuizActive = true;
  timeLeft = 60;
  elements.timer.textContent = timeLeft;
  elements.timerContainer.classList.remove("hidden");
  questions = getRandomQuestions();
  score = 0;
  currentQuestion = 0;
  errors = [];
  updateScore();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    elements.timer.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);

  loadQuestion();
}

// Event Listeners
elements.registerButton.addEventListener("click", async () => {
  const name = elements.registerContainer.querySelector("#name").value;
  const number = elements.registerContainer.querySelector("#number").value;

  if (name && number) {
    try {
      await addDoc(collection(db, "users"), {
        name,
        number,
        score: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        lastPlayed: new Date()
      });
      elements.registerContainer.style.display = "none";
      elements.mainContainer.classList.remove("hidden");
      startQuiz();
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

elements.restartButton.addEventListener("click", () => {
  elements.endScreen.classList.add("hidden");
  startQuiz();
});

elements.submitFeedback.addEventListener("click", async () => {
  const feedbackText = elements.feedbackText.value;
  const userName = elements.registerContainer.querySelector("#name").value;

  if (feedbackText) {
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: userName,
        text: feedbackText,
        timestamp: new Date()
      });
      alert("Obrigado pelo seu feedback!");
      elements.feedbackText.value = "";
    } catch (error) {
      console.error("Erro ao enviar feedback: ", error);
    }
  } else {
    alert("Por favor, escreva seu feedback antes de enviar!");
  }
});

// Navegação entre abas
elements.quizTab.addEventListener("click", () => {
  elements.quizContainer.classList.remove("hidden");
  elements.libraryContainer.classList.add("hidden");
  elements.rankingContainer.classList.add("hidden");
  elements.feedbackContainer.classList.add("hidden");
  elements.endScreen.classList.add("hidden");
});

elements.libraryTab.addEventListener("click", () => {
  elements.libraryContainer.classList.remove("hidden");
  elements.quizContainer.classList.add("hidden");
  elements.rankingContainer.classList.add("hidden");
  elements.feedbackContainer.classList.add("hidden");
  elements.endScreen.classList.add("hidden");
});

elements.rankingTab.addEventListener("click", async () => {
  elements.rankingContainer.classList.remove("hidden");
  elements.quizContainer.classList.add("hidden");
  elements.libraryContainer.classList.add("hidden");
  elements.feedbackContainer.classList.add("hidden");
  elements.endScreen.classList.add("hidden");

  elements.rankingList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "users"));
  const users = [];

  querySnapshot.forEach(doc => {
    let userData = doc.data();
    users.push({
      name: userData.name,
      score: userData.score || 0
    });
  });

  users.sort((a, b) => b.score - a.score);

  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.className = "animate-in";
    li.style.animationDelay = `${index * 0.1}s`;
    li.innerHTML = `
      <span>${index + 1}. ${user.name}</span>
      <span>Pontos: ${user.score}</span>
    `;
    elements.rankingList.appendChild(li);
  });
});

elements.feedbackTab.addEventListener("click", () => {
  elements.feedbackContainer.classList.remove("hidden");
  elements.quizContainer.classList.add("hidden");
  elements.libraryContainer.classList.add("hidden");
  elements.rankingContainer.classList.add("hidden");
  elements.endScreen.classList.add("hidden");
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Configura estado inicial
  elements.mainContainer.classList.add("hidden");
  elements.quizContainer.classList.remove("hidden");
  elements.libraryContainer.classList.add("hidden");
  elements.rankingContainer.classList.add("hidden");
  elements.feedbackContainer.classList.add("hidden");
  elements.endScreen.classList.add("hidden");
  elements.timerContainer.classList.add("hidden");
});
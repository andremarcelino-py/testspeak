import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  getDoc,
  query,
  orderBy,
  where,
  limit
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Configuração do Firebase
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
let currentUser = null;
let timer;
let timeLeft = 60;
let isQuizActive = false;
let questions = [];
let score = 0;
let currentQuestion = 0;
let errors = [];

// Elementos DOM
const elements = {
  // Cadastro
  registerContainer: document.getElementById("register-container"),
  registerButton: document.getElementById("register-button"),
  nameInput: document.getElementById("name"),
  numberInput: document.getElementById("number"),
  
  // Main Container
  mainContainer: document.getElementById("main-container"),
  
  // Quiz
  quizContainer: document.getElementById("quiz-container"),
  questionElement: document.getElementById("question"),
  optionsElement: document.getElementById("options"),
  scoreElement: document.getElementById("score"),
  timerContainer: document.getElementById("timer-container"),
  timerElement: document.getElementById("timer"),
  progressBar: document.querySelector(".progress"),
  
  // Telas
  libraryContainer: document.getElementById("library-container"),
  rankingContainer: document.getElementById("ranking-container"),
  feedbackContainer: document.getElementById("feedback-container"),
  endScreen: document.getElementById("end-screen"),
  
  // Abas
  quizTab: document.getElementById("quizTab"),
  libraryTab: document.getElementById("libraryTab"),
  rankingTab: document.getElementById("rankingTab"),
  feedbackTab: document.getElementById("feedbackTab"),
  
  // Ranking
  rankingList: document.getElementById("ranking-list"),
  
  // Feedback
  feedbackText: document.getElementById("feedback-text"),
  submitFeedback: document.getElementById("submit-feedback"),
  
  // Final
  finalMessage: document.getElementById("final-message"),
  errorList: document.getElementById("error-list"),
  restartButton: document.getElementById("restart-button")
};

// Perguntas do quiz
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

function startQuiz() {
  isQuizActive = true;
  timeLeft = 60;
  score = 0;
  currentQuestion = 0;
  errors = [];
  
  elements.timerElement.textContent = timeLeft;
  elements.timerContainer.classList.remove("hidden");
  elements.scoreElement.textContent = score;
  
  questions = getRandomQuestions();
  
  // Limpa timer existente
  if (timer) clearInterval(timer);
  
  timer = setInterval(() => {
    timeLeft--;
    elements.timerElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);

  loadQuestion();
}

function loadQuestion() {
  const progress = (currentQuestion / questions.length) * 100;
  elements.progressBar.style.width = `${progress}%`;
  
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    elements.questionElement.textContent = q.question;
    elements.optionsElement.innerHTML = "";
    
    q.options.forEach((option, index) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.addEventListener("click", () => checkAnswer(index));
      elements.optionsElement.appendChild(li);
    });
  } else {
    endQuiz();
  }
}

function checkAnswer(selected) {
  if (!isQuizActive) return;

  const q = questions[currentQuestion];
  const options = elements.optionsElement.children;

  // Mostra feedback visual
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("correct", "wrong");
    if (i === q.answer) {
      options[i].classList.add("correct");
    } else if (i === selected) {
      options[i].classList.add("wrong");
    }
    options[i].style.pointerEvents = "none";
  }

  // Verifica resposta
  if (selected === q.answer) {
    score++;
    elements.scoreElement.textContent = score;
  } else {
    errors.push(`Pergunta: ${q.question} - Resposta correta: ${q.options[q.answer]}`);
  }

  // Próxima pergunta
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      questions = getRandomQuestions();
      currentQuestion = 0;
    }
    loadQuestion();
  }, 1500);
}

function endQuiz() {
  isQuizActive = false;
  clearInterval(timer);
  elements.timerContainer.classList.add("hidden");
  
  elements.quizContainer.classList.remove("active");
  elements.endScreen.classList.add("active");
  
  elements.finalMessage.textContent = `Pontuação Final: ${score} pontos`;
  elements.errorList.innerHTML = errors.map(err => `<li>${err}</li>`).join("");
  
  // Salva a pontuação
  if (currentUser) {
    saveScore(currentUser, score);
  }
}

async function saveScore(userName, score) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", userName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Novo usuário
      await addDoc(usersRef, {
        name: userName,
        score: score,
        lastPlayed: new Date()
      });
    } else {
      // Usuário existente - atualiza
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        score: (userDoc.data().score || 0) + score,
        lastPlayed: new Date()
      });
    }
    
    // Atualiza o ranking
    await loadRanking();
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error);
  }
}

async function loadRanking() {
  elements.rankingList.innerHTML = '<li class="loading">Carregando ranking...</li>';
  
  try {
    const q = query(collection(db, "users"), orderBy("score", "desc"), limit(100));
    const querySnapshot = await getDocs(q);
    
    const rankings = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rankings.push({
        name: data.name,
        score: data.score || 0,
        lastPlayed: data.lastPlayed?.toDate() || new Date(0)
      });
    });

    displayRanking(rankings);
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    elements.rankingList.innerHTML = '<li class="error">Erro ao carregar ranking</li>';
  }
}

function displayRanking(rankings) {
  elements.rankingList.innerHTML = '';

  if (rankings.length === 0) {
    elements.rankingList.innerHTML = '<li class="empty">Nenhum jogador ainda</li>';
    return;
  }

  rankings.forEach((player, index) => {
    const li = document.createElement("li");
    li.className = `rank-item ${index < 3 ? `top-${index + 1}` : ''}`;
    
    li.innerHTML = `
      <span class="rank-position">${index + 1}º</span>
      <span class="rank-name">${player.name}</span>
      <span class="rank-score">${player.score} pts</span>
      <span class="rank-date">${formatDate(player.lastPlayed)}</span>
    `;
    
    elements.rankingList.appendChild(li);
  });
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Navegação entre abas
function showTab(tab) {
  // Esconde todas as telas
  document.querySelectorAll('.content-container').forEach(container => {
    container.classList.remove('active');
  });
  
  // Remove active de todas as abas
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  
  // Mostra a tela selecionada
  tab.container.classList.add('active');
  tab.button.classList.add('active');
}

// Event Listeners
elements.registerButton.addEventListener("click", async () => {
  const name = elements.nameInput.value.trim();
  const number = elements.numberInput.value.trim();

  if (name && number) {
    try {
      currentUser = name;
      elements.registerContainer.style.display = "none";
      elements.mainContainer.style.display = "block";
      startQuiz();
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Ocorreu um erro ao registrar. Por favor, tente novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos!");
  }
});

elements.restartButton.addEventListener("click", () => {
  elements.endScreen.classList.remove("active");
  elements.quizContainer.classList.add("active");
  startQuiz();
});

elements.submitFeedback.addEventListener("click", async () => {
  const feedback = elements.feedbackText.value.trim();
  
  if (feedback) {
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: currentUser || "Anônimo",
        text: feedback,
        timestamp: new Date()
      });
      
      alert("Obrigado pelo seu feedback!");
      elements.feedbackText.value = "";
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Ocorreu um erro ao enviar seu feedback.");
    }
  } else {
    alert("Por favor, escreva seu feedback antes de enviar.");
  }
});

// Configura abas
const tabs = [
  { button: elements.quizTab, container: elements.quizContainer },
  { button: elements.libraryTab, container: elements.libraryContainer },
  { button: elements.rankingTab, container: elements.rankingContainer },
  { button: elements.feedbackTab, container: elements.feedbackContainer }
];

tabs.forEach(tab => {
  tab.button.addEventListener("click", async () => {
    showTab(tab);
    
    // Carrega o ranking quando a aba é acessada
    if (tab.container === elements.rankingContainer) {
      await loadRanking();
    }
  });
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Configura estado inicial
  elements.mainContainer.style.display = "none";
  showTab(tabs[0]); // Mostra a aba do quiz inicialmente
  
  // Esconde elementos que devem começar ocultos
  elements.timerContainer.classList.add("hidden");
  elements.endScreen.classList.remove("active");
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc
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

/* Containers */
const registerContainer       = document.getElementById("register-container");
const menuContainer           = document.getElementById("menu-container");
const quizContainer           = document.getElementById("quiz-container");
const englishMenuContainer    = document.getElementById("english-menu-container");
const englishQuestionsQuizContainer = document.getElementById("english-questions-quiz-container");
const englishLibraryContainer = document.getElementById("english-library-container");
const rankingContainer        = document.getElementById("ranking-container");
const endScreen               = document.getElementById("end-screen");

const spanishMenuContainer    = document.getElementById("spanish-menu-container");
const spanishContainer        = document.getElementById("spanish-container");
const spanishEndScreen        = document.getElementById("spanish-end-screen");
const spanishLibraryContainer = document.getElementById("spanish-library-container");

const frenchMenuContainer     = document.getElementById("french-menu-container");
const frenchContainer         = document.getElementById("french-container");
const frenchEndScreen         = document.getElementById("french-end-screen");
const frenchLibraryContainer  = document.getElementById("french-library-container");

/* Botões Principais */
const startButton             = document.getElementById("start-button");
const btnQuiz                 = document.getElementById("btnQuiz");
const btnEnglish              = document.getElementById("btnEnglish");
const btnSpanish              = document.getElementById("btnSpanish");
const btnFrench               = document.getElementById("btnFrench");
const btnRanking              = document.getElementById("btnRanking");

/* Botões do Submenu Inglês */
const btnEnglishQuestions     = document.getElementById("btnEnglishQuestions");
const btnEnglishLibrary       = document.getElementById("btnEnglishLibrary");
const backButtonEnglishMenu   = document.getElementById("backButtonEnglishMenu");

/* Botões de Nível para o Quiz de Perguntas em Inglês */
const btnFacil                = document.getElementById("btnFacil");
const btnMedio                = document.getElementById("btnMedio");
const btnDificil              = document.getElementById("btnDificil");

/* Elementos do Quiz Original (Inglês) */
const questionElement         = document.getElementById("question");
const optionsElement          = document.getElementById("options");
const scoreElement            = document.getElementById("score");
const timerElement            = document.getElementById("timer");
const finalMessageElement     = document.getElementById("final-message");
const errorListElement        = document.getElementById("error-list");
const rankingList             = document.getElementById("ranking-list");

/* Elementos do Quiz de Perguntas em Inglês */
const englishQuestionsQuestion    = document.getElementById("english-questions-question");
const englishQuestionsOptions     = document.getElementById("english-questions-options");
const englishQuestionsScore       = document.getElementById("english-questions-score");
const englishQuestionsTimer       = document.getElementById("english-questions-timer");
const englishQuestionsFinalMessage= document.getElementById("english-questions-final-message");
const englishQuestionsErrorList   = document.getElementById("english-questions-error-list");

/* Elementos do Quiz em Español */
const spanishQuestionElement    = document.getElementById("spanish-question");
const spanishOptionsElement     = document.getElementById("spanish-options");
const spanishScoreElement       = document.getElementById("spanish-score");
const spanishTimerElement       = document.getElementById("spanish-timer");
const spanishFinalMessageEl     = document.getElementById("spanish-final-message");
const spanishErrorListEl        = document.getElementById("spanish-error-list");

/* Elementos do Quiz en Français */
const frenchQuestionElement     = document.getElementById("french-question");
const frenchOptionsElement      = document.getElementById("french-options");
const frenchScoreElement        = document.getElementById("french-score");
const frenchTimerElement        = document.getElementById("french-timer");
const frenchFinalMessageEl      = document.getElementById("french-final-message");
const frenchErrorListEl         = document.getElementById("french-error-list");

/* Botões de reinício e menu para Español e Français */
const spanishRestartButton      = document.getElementById("spanish-restart-button");
const spanishMenuButton         = document.getElementById("spanish-menu-button");
const frenchRestartButton       = document.getElementById("french-restart-button");
const frenchMenuButton          = document.getElementById("french-menu-button");

/* Dados Fixos para o Quiz (usados nos modos Quiz original e Questions) */
const allQuestionsData = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am a student","I am student","I student am","A student I am"], answer: 0, difficulty:"easy", libraryRef:"phrases-english" },
  { question: "Which one is correct?", options: ["Do you like pizza?","Like pizza you?","Pizza do you like?","You pizza like?"], answer: 0, difficulty:"easy", libraryRef:"phrases-english" },
  { question: "What does 'I am learning English' mean?", options: ["Eu estou aprendendo inglês","Eu aprendi inglês","Eu ensino inglês","Eu amo inglês"], answer: 0, difficulty:"medium", libraryRef:"phrases-english" },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where are you living?","Where do you live?","Where is you live?","Where you live?"], answer: 1, difficulty:"medium", libraryRef:"phrases-english" },
  { question: "What is the plural of 'child'?", options: ["Childs","Children","Childes","Childern"], answer: 1, difficulty:"hard", libraryRef:"verbos" },
  { question: "How do you say 'bom dia' in English?", options: ["Good morning","Good evening","Good night","Hello"], answer: 0, difficulty:"easy", libraryRef:"greetings" },
  { question: "What is the past tense of 'go'?", options: ["Go","Went","Gone","Going"], answer: 1, difficulty:"easy", libraryRef:"verbos" },
  { question: "Which sentence is correct?", options: ["He don't like apples","He doesn't like apples","He like apples","He doesn't likes apples"], answer: 1, difficulty:"medium", libraryRef:"grammar" },
  { question: "What does 'break a leg' mean?", options: ["Good luck","Break your leg","Run fast","Don't trip"], answer: 0, difficulty:"medium", libraryRef:"idioms" }
];

/* Variáveis do Quiz Original */
let questions = [], score = 0, currentQuestion = 0, errors = [], quizTimer = 0, timerInterval;
/* Variáveis do Quiz de Perguntas (Inglês) */
let englishQuestions = [], englishScore = 0, currentEnglishQuestion = 0, englishErrors = [], englishTimer = 0, englishTimerInterval;
/* Variáveis do Quiz em Español */
let spanishQuestions = [], spanishScore = 0, currentSpanishQuestion = 0, spanishErrors = [], spanishTimer = 0, spanishTimerInterval;
/* Variáveis do Quiz en Français */
let frenchQuestions = [], frenchScore = 0, currentFrenchQuestion = 0, frenchErrors = [], frenchTimer = 0, frenchTimerInterval;

/* Função para esconder todas as seções */
function hideAllSections() {
  [
    registerContainer, menuContainer, quizContainer, englishMenuContainer,
    englishQuestionsQuizContainer, englishLibraryContainer, rankingContainer, endScreen,
    spanishMenuContainer, spanishContainer, spanishEndScreen, spanishLibraryContainer,
    frenchMenuContainer, frenchContainer, frenchEndScreen, frenchLibraryContainer
  ].forEach(sec => { if(sec) sec.style.display = "none"; });
}

/* Função para voltar ao menu principal */
function backToMenu() {
  stopTimer();
  stopEnglishTimer();
  stopSpanishTimer();
  stopFrenchTimer();
  hideAllSections();
  menuContainer.style.display = "block";
}

/* Conecta botões de voltar */
["backButtonEnglishMenu", "backButtonPerguntas", "backButtonLibrary", "backButtonRanking", "backButtonEndScreen", "backButtonSpanishMenu", "backButtonSpanishEndScreen", "backButtonFrenchMenu", "backButtonFrenchEndScreen"].forEach(id => {
  const btn = document.getElementById(id);
  if(btn) btn.addEventListener("click", backToMenu);
});

/* --- CADASTRO --- */
startButton.addEventListener("click", async () => {
  const nameVal = document.getElementById("name").value.trim();
  const numberVal = document.getElementById("number").value.trim();
  if(!nameVal || !numberVal) {
    alert("Por favor, preencha todos os campos!");
    return;
  }
  try {
    await addDoc(collection(db, "users"), { name: nameVal, number: numberVal });
    hideAllSections();
    menuContainer.style.display = "block";
  } catch (err) {
    console.error("Erro ao salvar no Firestore:", err);
    alert("Erro no cadastro. Tente novamente.");
    registerContainer.style.display = "block";
  }
});

/* --- QUIZ ORIGINAL (Inglês) --- */
function getRandomQuestions() {
  return [...allQuestionsData].sort(() => Math.random() - 0.5).slice(0, 15);
}
function startTimer() {
  quizTimer = 0; timerElement.textContent = quizTimer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => { quizTimer++; timerElement.textContent = quizTimer; }, 1000);
}
function stopTimer() { clearInterval(timerInterval); }
function loadQuestion() {
  if(currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";
    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", () => checkAnswer(i));
      optionsElement.appendChild(li);
    });
  } else { endQuiz(); }
}
function checkAnswer(sel) {
  const q = questions[currentQuestion];
  const opts = optionsElement.querySelectorAll("li");
  opts.forEach((li, i) => {
    li.classList.remove("correct", "wrong");
    if(i === q.answer) li.classList.add("correct");
    else if(i === sel) li.classList.add("wrong");
    li.style.pointerEvents = "none";
  });
  if(sel === q.answer) { score++; scoreElement.textContent = score; }
  else { errors.push(`Pergunta: ${q.question} - Resposta correta: ${q.options[q.answer]}`); }
  setTimeout(() => { currentQuestion++; loadQuestion(); }, 1500);
}
function endQuiz() {
  stopTimer();
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação Final: ${score}/${questions.length} | Tempo: ${quizTimer}s`;
  errorListElement.innerHTML = errors.map(e => `<li class="error-item">${e}</li>`).join("");
  saveScore(document.getElementById("name").value.trim(), score, quizTimer);
}
btnQuiz.addEventListener("click", () => {
  hideAllSections();
  quizContainer.style.display = "block";
  questions = getRandomQuestions();
  score = 0; currentQuestion = 0; errors = [];
  scoreElement.textContent = score;
  startTimer();
  loadQuestion();
});
document.getElementById("restart-button").addEventListener("click", () => btnQuiz.click());

/* --- QUIZ DE PERGUNTAS (Inglês - Questions) --- */
function startEnglishTimer() {
  englishTimer = 0; englishQuestionsTimer.textContent = englishTimer;
  clearInterval(englishTimerInterval);
  englishTimerInterval = setInterval(() => { englishTimer++; englishQuestionsTimer.textContent = englishTimer; }, 1000);
}
function stopEnglishTimer() { clearInterval(englishTimerInterval); }
function loadEnglishQuestion() {
  if(currentEnglishQuestion < englishQuestions.length) {
    const q = englishQuestions[currentEnglishQuestion];
    englishQuestionsQuestion.textContent = q.question;
    englishQuestionsOptions.innerHTML = "";
    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", () => englishCheckAnswer(i));
      englishQuestionsOptions.appendChild(li);
    });
  } else { endEnglishQuestionsQuiz(); }
}
function englishCheckAnswer(sel) {
  const q = englishQuestions[currentEnglishQuestion];
  const opts = englishQuestionsOptions.querySelectorAll("li");
  opts.forEach((li, i) => {
    li.classList.remove("correct", "wrong");
    if(i === q.answer) li.classList.add("correct");
    else if(i === sel) li.classList.add("wrong");
    li.style.pointerEvents = "none";
  });
  if(sel === q.answer) { englishScore++; englishQuestionsScore.textContent = englishScore; }
  else {
    englishErrors.push({
      question: q.question,
      correct: q.options[q.answer],
      libraryRef: q.libraryRef
    });
  }
  setTimeout(() => { currentEnglishQuestion++; loadEnglishQuestion(); }, 1500);
}
function endEnglishQuestionsQuiz() {
  stopEnglishTimer();
  englishQuestionsQuizContainer.style.display = "none";
  document.getElementById("english-questions-end-screen").style.display = "block";
  englishQuestionsFinalMessage.textContent = `Pontuação Final: ${englishScore}/${englishQuestions.length} | Tempo: ${englishTimer}s`;
  englishQuestionsErrorList.innerHTML = englishErrors.map(err => `
    <li class="error-item">
      ${err.question}<br>
      Resposta correta: ${err.correct}
      <button class="aprenda-mais-button" onclick="showLibrarySection(err.libraryRef)">Aprenda Mais</button>
    </li>
  `).join("");
}
btnEnglishQuestions.addEventListener("click", () => {
  hideAllSections();
  englishQuestionsQuizContainer.style.display = "block";
  // Filtra perguntas do idioma inglês (usando allQuestionsData)
  englishQuestions = allQuestionsData.filter(q => q.libraryRef === "phrases-english" || q.libraryRef !== "")
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  englishScore = 0; currentEnglishQuestion = 0; englishErrors = [];
  englishQuestionsScore.textContent = englishScore;
  startEnglishTimer();
  loadEnglishQuestion();
});
document.getElementById("english-questions-restart-button").addEventListener("click", () => {
  btnEnglishQuestions.click();
});
document.getElementById("english-questions-menu-button").addEventListener("click", backToMenu);

/* --- Biblioteca em Inglês (original) --- */
// Já definida na seção "english-library-container" do HTML

/* --- MENU e Funcionalidades para Español --- */
function getRandomSpanishQuestions() {
  const all = [
    { question: "¿Cómo se dice 'Hello' en español?", options:["Hola","Adiós","Gracias","Por favor"], answer: 0, difficulty:"easy" },
    { question: "¿Qué significa 'Goodbye' en español?", options:["Hola","Adiós","Buenas noches","Gracias"], answer: 1, difficulty:"easy" },
    { question: "¿Cómo se dice 'Thank you' en español?", options:["Por favor","Gracias","De nada","Perdón"], answer: 1, difficulty:"easy" },
    { question: "¿Cuál es el plural de 'amigo'?", options:["Amigos","Amigas","Amigoes","Amigues"], answer: 0, difficulty:"medium" },
    { question: "¿Cómo se dice 'I am learning Spanish' en español?", options:["Estoy aprendiendo español","Aprendo español","Yo español aprendo","Aprendiendo estoy español"], answer: 0, difficulty:"medium" }
  ];
  return [...all].sort(() => Math.random() - 0.5).slice(0, 15);
}
function startSpanishTimer() {
  spanishTimer = 0; spanishTimerElement.textContent = spanishTimer;
  clearInterval(spanishTimerInterval);
  spanishTimerInterval = setInterval(() => { spanishTimer++; spanishTimerElement.textContent = spanishTimer; }, 1000);
}
function stopSpanishTimer() { clearInterval(spanishTimerInterval); }
function loadSpanishQuestion() {
  if(currentSpanishQuestion < spanishQuestions.length) {
    const q = spanishQuestions[currentSpanishQuestion];
    spanishQuestionElement.textContent = q.question;
    spanishOptionsElement.innerHTML = "";
    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", () => spanishCheckAnswer(i));
      spanishOptionsElement.appendChild(li);
    });
  } else { endSpanishQuiz(); }
}
function spanishCheckAnswer(sel) {
  const q = spanishQuestions[currentSpanishQuestion];
  const opts = spanishOptionsElement.querySelectorAll("li");
  opts.forEach((li, i) => {
    li.classList.remove("correct", "wrong");
    if(i === q.answer) li.classList.add("correct");
    else if(i === sel) li.classList.add("wrong");
    li.style.pointerEvents = "none";
  });
  if(sel === q.answer) { spanishScore++; spanishScoreElement.textContent = spanishScore; }
  else { spanishErrors.push(`Pregunta: ${q.question} - Respuesta correcta: ${q.options[q.answer]}`); }
  setTimeout(() => { currentSpanishQuestion++; loadSpanishQuestion(); }, 1500);
}
function endSpanishQuiz() {
  stopSpanishTimer();
  spanishContainer.style.display = "none";
  spanishEndScreen.style.display = "block";
  document.getElementById("spanish-final-message").textContent = `Puntuación Final: ${spanishScore}/${spanishQuestions.length} | Tiempo: ${spanishTimer}s`;
  spanishErrorListEl.innerHTML = spanishErrors.map(e => `
    <li class="error-item">
      ${e}<br>
      <button class="aprenda-mais-button" onclick="showLibrarySectionSpanish()">Aprenda Mais</button>
    </li>
  `).join("");
}
window.showLibrarySectionSpanish = function() {
  hideAllSections();
  spanishLibraryContainer.style.display = "block";
};
btnSpanish.addEventListener("click", () => {
  hideAllSections();
  spanishMenuContainer.style.display = "block";
});
document.getElementById("btnSpanishQuiz").addEventListener("click", () => {
  hideAllSections();
  spanishContainer.style.display = "block";
  spanishQuestions = getRandomSpanishQuestions();
  spanishScore = 0; currentSpanishQuestion = 0; spanishErrors = [];
  spanishScoreElement.textContent = spanishScore;
  startSpanishTimer();
  loadSpanishQuestion();
});
document.getElementById("btnSpanishLibrary").addEventListener("click", () => {
  hideAllSections();
  spanishLibraryContainer.style.display = "block";
});
document.getElementById("backButtonSpanishMenu").addEventListener("click", backToMenu);
document.getElementById("backButtonSpanishEndScreen").addEventListener("click", backToMenu);
document.getElementById("spanish-restart-button").addEventListener("click", () => {
  document.getElementById("btnSpanishQuiz").click();
});
document.getElementById("spanish-menu-button").addEventListener("click", backToMenu);

/* --- QUIZ en Français --- */
function getRandomFrenchQuestions() {
  const all = [
    { question: "Comment dit-on 'Hello' en français?", options:["Bonjour","Au revoir","Merci","S'il vous plaît"], answer: 0, difficulty:"easy" },
    { question: "Que signifie 'Goodbye' en français?", options:["Bonjour","Au revoir","Bonne nuit","Merci"], answer: 1, difficulty:"easy" },
    { question: "Comment dit-on 'Thank you' en français?", options:["S'il vous plaît","Merci","De rien","Pardon"], answer: 1, difficulty:"easy" },
    { question: "Quel est le pluriel de 'ami'?", options:["Amis","Amies","Amis","Ami(e)s"], answer: 0, difficulty:"medium" },
    { question: "Comment dit-on 'I am learning French' en français?", options:["J'apprends le français","Je français apprends","J'apprendrai le français","Je suis en train d'apprendre le français"], answer: 0, difficulty:"medium" }
  ];
  return [...all].sort(() => Math.random() - 0.5).slice(0, 15);
}
function startFrenchTimer() {
  frenchTimer = 0; frenchTimerElement.textContent = frenchTimer;
  clearInterval(frenchTimerInterval);
  frenchTimerInterval = setInterval(() => { frenchTimer++; frenchTimerElement.textContent = frenchTimer; }, 1000);
}
function stopFrenchTimer() { clearInterval(frenchTimerInterval); }
function loadFrenchQuestion() {
  if(currentFrenchQuestion < frenchQuestions.length) {
    const q = frenchQuestions[currentFrenchQuestion];
    frenchQuestionElement.textContent = q.question;
    frenchOptionsElement.innerHTML = "";
    q.options.forEach((opt, i) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", () => frenchCheckAnswer(i));
      frenchOptionsElement.appendChild(li);
    });
  } else { endFrenchQuiz(); }
}
function frenchCheckAnswer(sel) {
  const q = frenchQuestions[currentFrenchQuestion];
  const opts = frenchOptionsElement.querySelectorAll("li");
  opts.forEach((li, i) => {
    li.classList.remove("correct", "wrong");
    if(i === q.answer) li.classList.add("correct");
    else if(i === sel) li.classList.add("wrong");
    li.style.pointerEvents = "none";
  });
  if(sel === q.answer) { frenchScore++; frenchScoreElement.textContent = frenchScore; }
  else { frenchErrors.push(`Question: ${q.question} - Réponse correcte: ${q.options[q.answer]}`); }
  setTimeout(() => { currentFrenchQuestion++; loadFrenchQuestion(); }, 1500);
}
function endFrenchQuiz() {
  stopFrenchTimer();
  frenchContainer.style.display = "none";
  frenchEndScreen.style.display = "block";
  frenchFinalMessageEl.textContent = `Score Final: ${frenchScore}/${frenchQuestions.length} | Temps: ${frenchTimer}s`;
  frenchErrorListEl.innerHTML = frenchErrors.map(e => `
    <li class="error-item">
      ${e}<br>
      <button class="aprenda-mais-button" onclick="showLibrarySectionFrench()">En savoir plus</button>
    </li>
  `).join("");
}
window.showLibrarySectionFrench = function() {
  hideAllSections();
  frenchLibraryContainer.style.display = "block";
};
btnFrench.addEventListener("click", () => {
  hideAllSections();
  frenchMenuContainer.style.display = "block";
});
document.getElementById("btnFrenchQuiz").addEventListener("click", () => {
  hideAllSections();
  frenchContainer.style.display = "block";
  frenchQuestions = getRandomFrenchQuestions();
  frenchScore = 0; currentFrenchQuestion = 0; frenchErrors = [];
  frenchScoreElement.textContent = frenchScore;
  startFrenchTimer();
  loadFrenchQuestion();
});
document.getElementById("btnFrenchLibrary").addEventListener("click", () => {
  hideAllSections();
  frenchLibraryContainer.style.display = "block";
});
document.getElementById("backButtonFrenchMenu").addEventListener("click", backToMenu);
document.getElementById("backButtonFrenchEndScreen").addEventListener("click", backToMenu);
frenchRestartButton.addEventListener("click", () => { document.getElementById("btnFrenchQuiz").click(); });
frenchMenuButton.addEventListener("click", backToMenu);

/* --- SALVAR PONTUAÇÃO --- */
async function saveScore(userName, score, time) {
  const snap = await getDocs(collection(db, "users"));
  let userDoc = null;
  snap.forEach(doc => {
    if (doc.data().name === userName) userDoc = doc.ref;
  });
  if(userDoc) await updateDoc(userDoc, { score, time });
}

/* --- MENU RANKING --- */
document.getElementById("btnRanking").addEventListener("click", async () => {
  hideAllSections();
  rankingContainer.style.display = "block";
  rankingList.innerHTML = "";
  const snap = await getDocs(collection(db, "users"));
  let users = [];
  snap.forEach(doc => {
    let data = doc.data();
    users.push({ name: data.name, score: data.score || 0, time: data.time || 9999 });
  });
  users = users.filter(u => u.time !== 9999)
    .sort((a, b) => (b.score - a.score) || (a.time - b.time));
  users.forEach((u, i) => {
    const li = document.createElement("li");
    li.className = "animate-in";
    li.style.animationDelay = `${i * 0.1}s`;
    li.innerHTML = `<span>${i+1}. ${u.name}</span><span>Pontos: ${u.score} | Tempo: ${u.time}s</span>`;
    rankingList.appendChild(li);
  });
});

/* --- Dados Fixos para o Quiz (Inglês) --- */
// allQuestionsData já está definida

/* Eventos para navegar nos submenus */
// Para Inglês
btnEnglish.addEventListener("click", () => {
  hideAllSections();
  englishMenuContainer.style.display = "block";
});
btnEnglishLibrary.addEventListener("click", () => {
  hideAllSections();
  englishLibraryContainer.style.display = "block";
});
btnEnglishQuestions.addEventListener("click", () => {
  hideAllSections();
  englishQuestionsQuizContainer.style.display = "block";
  // Aqui, você pode filtrar as perguntas se desejar; neste exemplo usamos todas
  englishQuestions = [...allQuestionsData].sort(() => Math.random() - 0.5).slice(0, 10);
  englishScore = 0; currentEnglishQuestion = 0; englishErrors = [];
  englishQuestionsScore.textContent = englishScore;
  startEnglishTimer();
  loadEnglishQuestion();
});
/* --- Fim do script.js --- */
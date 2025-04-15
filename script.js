import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Configuração Firebase
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

// Seleção dos Containers e Elementos
const welcomeContainer      = document.getElementById("welcome-container");
const registerContainer     = document.getElementById("register-container");
const loginContainer        = document.getElementById("login-container");
const menuContainer         = document.getElementById("menu-container");
const quizContainer         = document.getElementById("quiz-container");
const perguntasContainer    = document.getElementById("perguntas-container");
const perguntasQuizContainer= document.getElementById("perguntas-quiz-container");
const libraryContainer      = document.getElementById("library-container");
const rankingContainer      = document.getElementById("ranking-container");
const endScreen             = document.getElementById("end-screen");
const perguntasEndScreen    = document.getElementById("perguntas-end-screen");
const spanishMenuContainer  = document.getElementById("spanish-menu-container");
const spanishQuizContainer  = document.getElementById("spanish-container");
const spanishEndScreen      = document.getElementById("spanish-end-screen");
const spanishLibraryContainer = document.getElementById("spanish-library-container");
const frenchMenuContainer   = document.getElementById("french-menu-container");
const frenchQuizContainer   = document.getElementById("french-container");
const frenchEndScreen       = document.getElementById("french-end-screen");
const frenchLibraryContainer= document.getElementById("french-library-container");

// Novo: Container da Learning Track
const learningTrackContainer = document.getElementById("learning-track-container");

// Elementos de Boas-Vindas e Login/Cadastro
const btnRegisterNow = document.getElementById("btn-register-now");
const btnLoginWelcome  = document.getElementById("btn-login");
const startButton         = document.getElementById("start-button");
const loginButton         = document.getElementById("login-button");
const goLoginLink         = document.getElementById("go-login");
const goRegisterLink      = document.getElementById("go-register");

// Outros botões do menu
const btnQuiz             = document.getElementById("btnQuiz");
const btnPerguntas        = document.getElementById("btnPerguntas");
const btnLibrary          = document.getElementById("btnLibrary");
const btnRanking          = document.getElementById("btnRanking");
const btnFacil            = document.getElementById("btnFacil");
const btnMedio            = document.getElementById("btnMedio");
const btnDificil          = document.getElementById("btnDificil");
const restartButton       = document.getElementById("restart-button");
const perguntasRestartButton = document.getElementById("perguntas-restart-button");
const perguntasMenuButton    = document.getElementById("perguntas-menu-button");
const btnSpanish          = document.getElementById("btnSpanish");
const btnSpanishQuiz      = document.getElementById("btnSpanishQuiz");
const btnSpanishLibrary   = document.getElementById("btnSpanishLibrary");
const backButtonSpanishMenu = document.getElementById("backButtonSpanishMenu");
const spanishRestartButton  = document.getElementById("spanish-restart-button");
const spanishMenuButton     = document.getElementById("spanish-menu-button");
const btnFrench           = document.getElementById("btnFrench");
const btnFrenchQuiz       = document.getElementById("btnFrenchQuiz");
const btnFrenchLibrary    = document.getElementById("btnFrenchLibrary");
const backButtonFrenchMenu = document.getElementById("backButtonFrenchMenu");
const frenchRestartButton  = document.getElementById("french-restart-button");
const frenchMenuButton     = document.getElementById("french-menu-button");
// Novo: Botão para Learning Track
const btnLearning         = document.getElementById("btnLearning");

// Elementos da English Learning Track
const levelContent = document.getElementById("level-content");
const levelTitle = document.getElementById("level-title");
const readingText = document.getElementById("reading-text");
const explanationText = document.getElementById("explanation-text");
const levelQuestion = document.getElementById("level-question");
const levelOptions = document.getElementById("level-options");
const translationSection = document.getElementById("translation-section");
const englishButtons = document.getElementById("english-buttons");
const portugueseButtons = document.getElementById("portuguese-buttons");
const checkAllBtn = document.getElementById("check-all-translations");
const nextLevelBtn = document.getElementById("next-level-btn");

const slidesContainer = document.querySelector(".carousel-slides");
const prevBtn = document.getElementById("prev-phase");
const nextBtn = document.getElementById("next-phase");
const startBtn = document.getElementById("start-english-track");
const phaseCarousel = document.getElementById("phase-carousel");

// Função initCarousel corrigida
function initCarousel() {
  slidesContainer.innerHTML = "";
  levelsData.forEach(lv => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.innerHTML = `<h3>Fase ${lv.level}</h3><p>${lv.readingText}</p>`;
    slidesContainer.appendChild(slide);
  });
  updateCarousel();
}
function updateCarousel() {
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}
prevBtn.onclick = () => { currentSlide = (currentSlide - 1 + levelsData.length) % levelsData.length; updateCarousel(); };
nextBtn.onclick = () => { currentSlide = (currentSlide + 1) % levelsData.length; updateCarousel(); };
startBtn.onclick = () => { phaseCarousel.classList.add("hidden"); startEnglishTrack(); };

// Função startEnglishTrack corrigida
function startEnglishTrack() {
  hideAllSections();
  learningTrackContainer.classList.remove("hidden");
  currentLevelIndex = 0;
  loadLevel(currentLevelIndex);


// Carrega um nível
function loadLevel(idx) {
  const lvl = levelsData[idx];
  levelTitle.textContent = `Level ${lvl.level}`;
  readingText.textContent = lvl.readingText;
  explanationText.textContent = lvl.explanation;
  levelQuestion.textContent = lvl.question;
  levelOptions.innerHTML = "";
  lvl.options.forEach((opt,i) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.addEventListener("click", () => checkLevelAnswer(i, lvl));
    levelOptions.appendChild(li);
  });
  translationSection.classList.add("hidden");
  checkAllBtn.classList.add("hidden");
  nextLevelBtn.classList.add("hidden");
}

// Verifica resposta de múltipla escolha
function checkLevelAnswer(sel, lvl) {
  const items = levelOptions.querySelectorAll("li");
  items.forEach((li,i) => {
    li.style.pointerEvents = "none";
    li.classList.remove("correct","wrong");
    if(i===lvl.correctAnswer) li.classList.add("correct");
    else if(i===sel) li.classList.add("wrong");
  });
  if(sel===lvl.correctAnswer) setTimeout(() => loadTranslationExercise(lvl), 800);
  else setTimeout(() => {
    alert("Incorrect. Try again.");
    items.forEach(li=>{ li.style.pointerEvents="auto"; li.classList.remove("correct","wrong"); });
  },800);
}

// Carrega exercício de tradução
function loadTranslationExercise(lvl) {
  translationSection.classList.remove("hidden");
  englishButtons.innerHTML = "";
  portugueseButtons.innerHTML = "";
  lvl.translationPairs.forEach(pair => {
    const btnEn = document.createElement("button"); btnEn.textContent = pair.en; btnEn.dataset.en = pair.en;
    btnEn.addEventListener("click", toggleSelect);
    englishButtons.appendChild(btnEn);
    const btnPt = document.createElement("button"); btnPt.textContent = pair.pt; btnPt.dataset.pt = pair.pt;
    btnPt.addEventListener("click", toggleSelect);
    portugueseButtons.appendChild(btnPt);
  });
  checkAllBtn.classList.remove("hidden");
}

// Marca seleção
function toggleSelect(e) {
  e.target.classList.toggle("selected");
}

// Verifica todas traduções
checkAllBtn.onclick = () => {
  const lvl = levelsData[currentLevelIndex];
  const selEn = [...englishButtons.children].filter(b=>b.classList.contains("selected")).map(b=>b.dataset.en);
  const selPt = [...portugueseButtons.children].filter(b=>b.classList.contains("selected")).map(b=>b.dataset.pt);
  const allCorrect = lvl.translationPairs.every((p,i) => selEn[i]===p.en && selPt[i]===p.pt);
  if(allCorrect) {
    alert("Todas as ligações corretas!");
    checkAllBtn.classList.add("hidden"); nextLevelBtn.classList.remove("hidden");
  } else {
    alert("Alguma ligação incorreta. Tente novamente.");
    [...englishButtons.children, ...portugueseButtons.children].forEach(b=>b.classList.remove("selected"));
  }
};

// Próximo nível
nextLevelBtn.onclick = () => {
  currentLevelIndex++;
  if(currentLevelIndex < levelsData.length) loadLevel(currentLevelIndex);
  else { alert("Parabéns! Você completou todos os níveis."); hideAllSections(); menuContainer.classList.remove("hidden"); }
};

// Eventos de navegação de login/cadastro/menu
btnRegisterNow.onclick = ()=>{ hideAllSections(); registerContainer.classList.remove("hidden"); };
btnLoginWelcome.onclick = ()=>{ hideAllSections(); loginContainer.classList.remove("hidden"); };
goLoginLink.onclick = ()=>{ registerContainer.classList.add("hidden"); loginContainer.classList.remove("hidden"); };
goRegisterLink.onclick = ()=>{ loginContainer.classList.add("hidden"); registerContainer.classList.remove("hidden"); };
startButton.onclick = async ()=>{/* mesma lógica de cadastro */};
loginButton.onclick = async ()=>{/* mesma lógica de login */};
btnLearning.onclick = ()=>{ phaseCarousel.classList.remove("hidden"); };

// Ao carregar a página
window.addEventListener("DOMContentLoaded", ()=>{ initCarousel(); phaseCarousel.classList.remove("hidden"); });






// Elementos do Quiz (inglês, perguntas, español, francês)
const questionElement       = document.getElementById("question");
const optionsElement        = document.getElementById("options");
const scoreElement          = document.getElementById("score");
const timerElement          = document.getElementById("timer");
const finalMessageElement   = document.getElementById("final-message");
const errorListElement      = document.getElementById("error-list");

const perguntasQuestionElement = document.getElementById("perguntas-question");
const perguntasOptionsElement  = document.getElementById("perguntas-options");
const perguntasScoreElement    = document.getElementById("perguntas-score");
const perguntasTimerElement    = document.getElementById("perguntas-timer");
const perguntasFinalMessageElement = document.getElementById("perguntas-final-message");
const perguntasErrorListElement    = document.getElementById("perguntas-error-list");

const spanishQuestionElement = document.getElementById("spanish-question");
const spanishOptionsElement  = document.getElementById("spanish-options");
const spanishScoreElement    = document.getElementById("spanish-score");
const spanishTimerElement    = document.getElementById("spanish-timer");
const spanishFinalMessageEl  = document.getElementById("spanish-final-message");
const spanishErrorListEl     = document.getElementById("spanish-error-list");

const frenchQuestionElement = document.getElementById("french-question");
const frenchOptionsElement  = document.getElementById("french-options");
const frenchScoreElement    = document.getElementById("french-score");
const frenchTimerElement    = document.getElementById("french-timer");
const frenchFinalMessageEl  = document.getElementById("french-final-message");
const frenchErrorListEl     = document.getElementById("french-error-list");


// Função hideAllSections unificada
function hideAllSections() {
  [
    welcomeContainer, registerContainer, loginContainer, menuContainer,
    quizContainer, perguntasContainer, perguntasQuizContainer,
    libraryContainer, rankingContainer, endScreen, perguntasEndScreen,
    spanishMenuContainer, spanishQuizContainer, spanishEndScreen, spanishLibraryContainer,
    frenchMenuContainer, frenchQuizContainer, frenchEndScreen, frenchLibraryContainer,
    learningTrackContainer, phaseCarousel
  ].forEach(sec => sec && (sec.style.display = "none"));
}

// Função para voltar ao menu
function backToMenu() {
  // Se estiver usando temporizadores de quiz, pare-os aqui.
  hideAllSections();
  menuContainer.style.display = "block";
}

// Conecta botões de voltar (mapeie os IDs existentes)
["backButtonQuiz", "backButtonPerguntas", "backButtonPerguntasQuiz", "backButtonLibrary", "backButtonRanking", "backButtonEndScreen", "backButtonPerguntasEndScreen", "backButtonSpanish", "backButtonSpanishLibrary", "backButtonSpanishEndScreen", "backButtonFrench", "backButtonFrenchLibrary", "backButtonFrenchEndScreen"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", backToMenu);
});

// Eventos para telas de boas-vindas, cadastro e login
btnRegisterNow.addEventListener("click", () => {
  hideAllSections();
  registerContainer.style.display = "block";
});
btnLoginWelcome.addEventListener("click", () => {
  hideAllSections();
  loginContainer.style.display = "block";
});

startButton.addEventListener("click", async () => {
  const nameInput     = document.getElementById("name").value.trim();
  const passwordInput = document.getElementById("register-password").value.trim();

  if (!nameInput || !passwordInput) {
    alert("Por favor, preencha todos os campos!");
    return;
  }
  
  hideAllSections();
  try {
    await addDoc(collection(db, "users"), { 
      name: nameInput, 
      password: passwordInput // Em produção, utilizar Firebase Authentication é recomendado
    });
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  } catch (err) {
    console.error("Erro ao salvar no Firestore:", err);
    alert("Não foi possível cadastrar. Tente novamente.");
    registerContainer.style.display = "block";
  }
});

loginButton.addEventListener("click", async () => {
  const loginName     = document.getElementById("login-name").value.trim();
  const loginPassword = document.getElementById("login-password").value.trim();

  if (!loginName || !loginPassword) {
    alert("Por favor, preencha todos os campos!");
    return;
  }
  
  try {
    const snap = await getDocs(collection(db, "users"));
    let userFound = false;
    snap.forEach(doc => {
      const userData = doc.data();
      if (userData.name === loginName && userData.password === loginPassword) {
        userFound = true;
        hideAllSections();
        menuContainer.style.display = "block";
      }
    });
    if (!userFound) {
      alert("Dados de login incorretos! Tente novamente.");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    alert("Erro ao efetuar login. Tente novamente.");
  }
});

goLoginLink.addEventListener("click", () => {
  registerContainer.style.display = "none";
  loginContainer.style.display = "block";
});
goRegisterLink.addEventListener("click", () => {
  loginContainer.style.display = "none";
  registerContainer.style.display = "block";
});

// ----------------------
// English Learning Track - NOVA FUNCIONALIDADE
// ----------------------

// Estrutura de dados para os 10 níveis
const levelsData = [
  {
    level: 1,
    readingText: "Este nível apresenta as saudações básicas em inglês.",
    explanation: "In this level, you will learn simple greetings and how to introduce yourself.",
    question: "What does 'Good morning' mean?",
    options: ["Bom dia", "Boa noite", "Olá", "Até logo"],
    correctAnswer: 0,
    translationPairs: [
      { en: "Hello", pt: "Olá" },
      { en: "Goodbye", pt: "Tchau" },
      { en: "Please", pt: "Por favor" }
    ]
  },
  {
    level: 2,
    readingText: "Este nível ensina as expressões para pedir informações.",
    explanation: "This level covers common expressions used when asking for information.",
    question: "How do you say 'Onde fica o banheiro?' in English?",
    options: ["Where is the kitchen?", "Where is the bathroom?", "How are you?", "What time is it?"],
    correctAnswer: 1,
    translationPairs: [
      { en: "Water", pt: "Água" },
      { en: "Bathroom", pt: "Banheiro" },
      { en: "Street", pt: "Rua" }
    ]
  },
  {
    level: 3,
    readingText: "Neste nível, você aprende vocabulário sobre alimentos.",
    explanation: "In this level, you will learn some common food vocabulary words.",
    question: "What is the correct translation for 'maçã'?",
    options: ["Apple", "Banana", "Orange", "Grape"],
    correctAnswer: 0,
    translationPairs: [
      { en: "Bread", pt: "Pão" },
      { en: "Cheese", pt: "Queijo" },
      { en: "Apple", pt: "Maçã" }
    ]
  },
  {
    level: 4,
    readingText: "O foco deste nível é a família e as relações pessoais.",
    explanation: "This level introduces vocabulary about family members and relationships.",
    question: "How do you say 'irmão' in English?",
    options: ["Sister", "Brother", "Cousin", "Uncle"],
    correctAnswer: 1,
    translationPairs: [
      { en: "Mother", pt: "Mãe" },
      { en: "Father", pt: "Pai" },
      { en: "Brother", pt: "Irmão" }
    ]
  },
  {
    level: 5,
    readingText: "Neste nível, você aprenderá sobre o tempo e as estações.",
    explanation: "This level covers vocabulary related to the weather and seasons.",
    question: "What is the English word for 'inverno'?",
    options: ["Spring", "Summer", "Winter", "Autumn"],
    correctAnswer: 2,
    translationPairs: [
      { en: "Hot", pt: "Quente" },
      { en: "Cold", pt: "Frio" },
      { en: "Rain", pt: "Chuva" }
    ]
  },
  {
    level: 6,
    readingText: "Este nível foca em atividades diárias e na rotina.",
    explanation: "In this level, you will learn phrases used to describe daily routines.",
    question: "What does 'I wake up' mean?",
    options: ["Eu durmo", "Eu acordo", "Eu almoço", "Eu estudo"],
    correctAnswer: 1,
    translationPairs: [
      { en: "Eat", pt: "Comer" },
      { en: "Sleep", pt: "Dormir" },
      { en: "Wake", pt: "Acordar" }
    ]
  },
  {
    level: 7,
    readingText: "Neste nível, o tema é os transportes.",
    explanation: "This level introduces vocabulary related to transportation.",
    question: "How do you say 'trem' in English?",
    options: ["Car", "Plane", "Train", "Boat"],
    correctAnswer: 2,
    translationPairs: [
      { en: "Bus", pt: "Ônibus" },
      { en: "Train", pt: "Trem" },
      { en: "Bike", pt: "Bicicleta" }
    ]
  },
  {
    level: 8,
    readingText: "Este nível aborda atividades de lazer.",
    explanation: "In this level, you'll learn vocabulary about hobbies and leisure activities.",
    question: "What does 'I like to read' mean in Portuguese?",
    options: ["Eu gosto de correr", "Eu gosto de ler", "Eu gosto de escrever", "Eu gosto de dormir"],
    correctAnswer: 1,
    translationPairs: [
      { en: "Read", pt: "Ler" },
      { en: "Write", pt: "Escrever" },
      { en: "Run", pt: "Correr" }
    ]
  },
  {
    level: 9,
    readingText: "Neste nível, o tema é o trabalho e a profissão.",
    explanation: "This level explains common job titles and work-related vocabulary.",
    question: "How do you say 'professor' in English?",
    options: ["Teacher", "Student", "Worker", "Engineer"],
    correctAnswer: 0,
    translationPairs: [
      { en: "Teacher", pt: "Professor" },
      { en: "Engineer", pt: "Engenheiro" },
      { en: "Student", pt: "Estudante" }
    ]
  },
  {
    level: 10,
    readingText: "O nível final explora expressões para descrever emoções.",
    explanation: "This level focuses on words related to emotions and feelings.",
    question: "What is the correct translation for 'feliz'?",
    options: ["Sad", "Angry", "Happy", "Tired"],
    correctAnswer: 2,
    translationPairs: [
      { en: "Happy", pt: "Feliz" },
      { en: "Angry", pt: "Bravo" },
      { en: "Sad", pt: "Triste" }
    ]
  }
];

let currentLevelIndex = 0; // índice dos níveis

// Carrega um nível com base no índice
function loadLevel(levelIndex) {
  const levelData = levelsData[levelIndex];
  if (!levelData) return;
  
  // Exibe a área de nível e atualiza os textos
  levelContent.style.display = "block";
  levelTitle.textContent = "Level " + levelData.level;
  readingText.textContent = levelData.readingText;
  explanationText.textContent = levelData.explanation;
  
  // Carrega a pergunta de múltipla escolha
  levelQuestion.textContent = levelData.question;
  levelOptions.innerHTML = "";
  levelData.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => checkLevelAnswer(i, levelData));
    levelOptions.appendChild(li);
  });
  
  // Oculta a seção de tradução e o botão de próximo nível inicialmente
  translationSection.style.display = "none";
  nextLevelBtn.style.display = "none";
}

// Verifica a resposta da pergunta do nível
function checkLevelAnswer(selectedIndex, levelData) {
  const optionsItems = levelOptions.querySelectorAll("li");
  optionsItems.forEach((li, i) => {
    li.style.pointerEvents = "none";
    li.classList.remove("correct", "wrong");
    if (i === levelData.correctAnswer) {
      li.classList.add("correct");
    } else if (i === selectedIndex) {
      li.classList.add("wrong");
    }
  });
  
  if (selectedIndex === levelData.correctAnswer) {
    // Se acertar, carrega o exercício de tradução após breve atraso
    setTimeout(() => {
      loadTranslationExercise(levelData);
    }, 1200);
  } else {
    alert("Incorrect. Please try again.");
    optionsItems.forEach(li => {
      li.style.pointerEvents = "auto";
      li.classList.remove("correct", "wrong");
    });
  }
}

// Carrega o exercício de tradução
function loadTranslationExercise(levelData) {
  translationSection.style.display = "block";
  englishButtons.innerHTML = "";
  portugueseButtons.innerHTML = "";
  
  // Cria arrays com os termos
  const englishWords = levelData.translationPairs.map(pair => pair.en);
  const portugueseWords = levelData.translationPairs.map(pair => pair.pt);
  
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  const shuffledEnglish = shuffle([...englishWords]);
  const shuffledPortuguese = shuffle([...portugueseWords]);
  
  // Cria botões para os termos em inglês
  shuffledEnglish.forEach(word => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.dataset.en = word;
    btn.addEventListener("click", handleTranslationSelection);
    englishButtons.appendChild(btn);
  });
  
  // Cria botões para os termos em português
  shuffledPortuguese.forEach(word => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.dataset.pt = word;
    btn.addEventListener("click", handleTranslationSelection);
    portugueseButtons.appendChild(btn);
  });
  
  window.selectedEnglish = null;
  window.selectedPortuguese = null;
}

// Lida com a seleção dos botões de tradução
function handleTranslationSelection(event) {
  const btn = event.target;
  if (btn.dataset.en) {
    clearGroupSelection("english-buttons");
    btn.classList.add("selected");
    window.selectedEnglish = btn.dataset.en;
  } else if (btn.dataset.pt) {
    clearGroupSelection("portuguese-buttons");
    btn.classList.add("selected");
    window.selectedPortuguese = btn.dataset.pt;
  }
  
  if (window.selectedEnglish && window.selectedPortuguese) {
    const currentLevel = levelsData[currentLevelIndex];
    const correct = currentLevel.translationPairs.some(pair => pair.en === window.selectedEnglish && pair.pt === window.selectedPortuguese);
    if (correct) {
      alert("Translation match correct!");
      clearGroupSelection("english-buttons");
      clearGroupSelection("portuguese-buttons");
      nextLevelBtn.style.display = "block";
      disableTranslationButtons();
    } else {
      alert("Incorrect match. Try again.");
      clearGroupSelection("english-buttons");
      clearGroupSelection("portuguese-buttons");
      window.selectedEnglish = null;
      window.selectedPortuguese = null;
    }
  }
}

// Limpa a seleção de botões em um grupo
function clearGroupSelection(containerId) {
  const container = document.getElementById(containerId);
  container.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
}

// Desabilita os botões após acerto no exercício de tradução
function disableTranslationButtons() {
  document.querySelectorAll("#english-buttons button, #portuguese-buttons button").forEach(btn => {
    btn.disabled = true;
  });
}

// Avança para o próximo nível
nextLevelBtn.addEventListener("click", () => {
  currentLevelIndex++;
  if (currentLevelIndex < levelsData.length) {
    loadLevel(currentLevelIndex);
  } else {
    alert("Congratulations! You have completed all levels.");
    hideAllSections();
    menuContainer.style.display = "block";
  }
});

// Evento de clique para iniciar a English Track corrigido
startBtn.onclick = () => { 
  phaseCarousel.classList.add("hidden"); 
  startEnglishTrack(); 
};
// --- QUIZ INGLÊS ---
let questions = [], score = 0, currentQuestion = 0, errors = [], quizTimer = 0, timerInterval;
function getRandomQuestions() {
  return [...allQuestions].sort(() => Math.random() - 0.5).slice(0,15);
}
function startTimer() {
  quizTimer = 0; timerElement.textContent = quizTimer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    quizTimer++; timerElement.textContent = quizTimer;
  },1000);
}
function stopTimer() { clearInterval(timerInterval); }
function loadQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";
    q.options.forEach((opt,i)=>{
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", ()=> checkAnswer(i));
      optionsElement.appendChild(li);
    });
  } else endQuiz();
}
function checkAnswer(sel) {
  const q = questions[currentQuestion];
  const opts = optionsElement.querySelectorAll("li");
  opts.forEach((li,i)=>{
    li.classList.remove("correct","wrong");
    if (i === q.answer) li.classList.add("correct");
    else if (i === sel) li.classList.add("wrong");
    li.style.pointerEvents = "none";
  });
  if (sel === q.answer) { score++; scoreElement.textContent = score; }
  else errors.push(`Pergunta: ${q.question} - Resposta: ${q.options[q.answer]}`);
  setTimeout(()=>{
    currentQuestion++; loadQuestion();
  },1500);
}
function endQuiz() {
  stopTimer();
  quizContainer.style.display = "none";
  endScreen.style.display = "block";
  finalMessageElement.textContent = `Pontuação Final: ${score}/${questions.length} | Tempo: ${quizTimer}s`;
  errorListElement.innerHTML = errors.map(e=>`<li class="error-item">${e}</li>`).join("");
  saveScore(document.getElementById("name").value.trim(), score, quizTimer);
}
btnQuiz.addEventListener("click", ()=>{
  hideAllSections();
  quizContainer.style.display = "block";
  questions = getRandomQuestions();
  score = 0; currentQuestion = 0; errors = [];
  scoreElement.textContent = score;
  startTimer();
  loadQuestion();
});
restartButton.addEventListener("click", ()=>{
  btnQuiz.click();
});

// --- QUIZ PERGUNTAS ---
let perguntasQuestions = [], perguntasScore = 0, currentPerguntaQuestion = 0, perguntasErrors = [], perguntasTimer = 0, perguntasTimerInterval;
function startPerguntasTimer() {
  perguntasTimer = 0; perguntasTimerElement.textContent = perguntasTimer;
  clearInterval(perguntasTimerInterval);
  perguntasTimerInterval = setInterval(()=>{
    perguntasTimer++; perguntasTimerElement.textContent = perguntasTimer;
  },1000);
}
function stopPerguntasTimer(){ clearInterval(perguntasTimerInterval); }
function loadPerguntasQuestion(){
  if (currentPerguntaQuestion < perguntasQuestions.length) {
    const q = perguntasQuestions[currentPerguntaQuestion];
    perguntasQuestionElement.textContent = q.question;
    perguntasOptionsElement.innerHTML = "";
    q.options.forEach((opt,i)=>{
      const li = document.createElement("li");
      li.textContent = opt;
      li.addEventListener("click", ()=> checkPerguntasAnswer(i));
      perguntasOptionsElement.appendChild(li);
    });
  } else endPerguntasQuiz();
}
function checkPerguntasAnswer(sel) {
  const q = perguntasQuestions[currentPerguntaQuestion];
  const opts = perguntasOptionsElement.querySelectorAll("li");
  opts.forEach((li,i)=>{
    li.classList.remove("correct","wrong");
    if (i === q.answer) li.classList.add("correct");
    else if (i === sel) li.classList.add("wrong");
    li.style.pointerEvents = "none";
  });
  if (sel === q.answer) { perguntasScore++; perguntasScoreElement.textContent = perguntasScore; }
  else perguntasErrors.push({ question: q.question, correct: q.options[q.answer], libraryRef: q.libraryRef });
  setTimeout(()=>{
    currentPerguntaQuestion++; loadPerguntasQuestion();
  },1500);
}
function endPerguntasQuiz() {
  stopPerguntasTimer();
  perguntasQuizContainer.style.display="none";
  perguntasEndScreen.style.display="block";
  perguntasFinalMessageElement.textContent = `Pontuação Final: ${perguntasScore}/${perguntasQuestions.length} | Tempo: ${perguntasTimer}s`;
  perguntasErrorListElement.innerHTML = perguntasErrors.map(err=>`
    <li class="error-item">
      ${err.question}<br>
      Resposta correta: ${err.correct}
      <button onclick="showLibrarySection('${err.libraryRef}')">Aprenda Mais</button>
    </li>
  `).join("");
}
function startPerguntasQuiz(dif) {
  perguntasQuestions = allQuestions.filter(q=>q.difficulty===dif).sort(()=>Math.random()-0.5).slice(0,10);
  perguntasScore=0; currentPerguntaQuestion=0; perguntasErrors=[];
  perguntasScoreElement.textContent=perguntasScore;
  hideAllSections();
  perguntasQuizContainer.style.display="block";
  startPerguntasTimer();
  loadPerguntasQuestion();
}
btnPerguntas.addEventListener("click", ()=>{ hideAllSections(); perguntasContainer.style.display="block"; });
btnFacil.addEventListener("click", ()=> startPerguntasQuiz("easy"));
btnMedio.addEventListener("click", ()=> startPerguntasQuiz("medium"));
btnDificil.addEventListener("click", ()=> startPerguntasQuiz("hard"));
perguntasRestartButton.addEventListener("click", ()=> startPerguntasQuiz(perguntasQuestions[0]?.difficulty||"easy"));
perguntasMenuButton.addEventListener("click", backToMenu);

// --- BIBLIOTECA ---
btnLibrary.addEventListener("click", ()=>{ hideAllSections(); libraryContainer.style.display="block"; });
window.showLibrarySection = function(sectionId){
  hideAllSections();
  libraryContainer.style.display="block";
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
};

// --- RANKING ---
btnRanking.addEventListener("click", async ()=>{
  hideAllSections();
  rankingContainer.style.display="block";
  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML="";
  const snap = await getDocs(collection(db,"users"));
  let users = [];
  snap.forEach(doc=> users.push({ name: doc.data().name, score: doc.data().score||0, time: doc.data().time||9999 }));
  users = users.filter(u=>u.time!==9999).sort((a,b)=>(b.score-a.score) || (a.time-b.time));
  users.forEach((u,i)=>{
    const li = document.createElement("li");
    li.className="animate-in";
    li.style.animationDelay=`${i*0.1}s`;
    li.innerHTML=`<span>${i+1}. ${u.name}</span><span>Pontos: ${u.score} | Tempo: ${u.time}s</span>`;
    rankingList.appendChild(li);
  });
});

// --- QUIZ ESPAÑOL ---
let spanishQuestions = [], spanishScore = 0, currentSpanishQuestion = 0, spanishErrors = [], spanishTimer = 0, spanishTimerInterval;
function getRandomSpanishQuestions() {
  const all = [
    { question: "¿Cómo se dice 'Hello' en español?", options:["Hola","Adiós","Gracias","Por favor"], answer:0 },
    { question: "¿Qué significa 'Goodbye' en español?", options:["Hola","Adiós","Buenas noches","Gracias"], answer:1 },
    { question: "¿Cómo se dice 'Thank you' en español?", options:["Por favor","Gracias","De nada","Perdón"], answer:1 },
    { question: "¿Cuál es el plural de 'amigo'?", options:["Amigos","Amigas","Amigoes","Amigues"], answer:0 },
    { question: "¿Cómo se dice 'I am learning Spanish' en español?", options:["Estoy aprendiendo español","Aprendo español","Yo español aprendo","Aprendiendo estoy español"], answer:0 }
  ];
  return [...all].sort(()=>Math.random()-0.5).slice(0,15);
}
function startSpanishTimer() {
  spanishTimer=0; spanishTimerElement.textContent=spanishTimer;
  clearInterval(spanishTimerInterval);
  spanishTimerInterval=setInterval(()=>{
    spanishTimer++; spanishTimerElement.textContent=spanishTimer;
  },1000);
}
function stopSpanishTimer(){ clearInterval(spanishTimerInterval); }
function loadSpanishQuestion() {
  if (currentSpanishQuestion < spanishQuestions.length) {
    const q = spanishQuestions[currentSpanishQuestion];
    spanishQuestionElement.textContent = q.question;
    spanishOptionsElement.innerHTML = "";
    q.options.forEach((opt,i)=>{
      const li=document.createElement("li");
      li.textContent=opt;
      li.addEventListener("click", ()=> spanishCheckAnswer(i));
      spanishOptionsElement.appendChild(li);
    });
  } else endSpanishQuiz();
}
function spanishCheckAnswer(sel) {
  const q=spanishQuestions[currentSpanishQuestion];
  const opts=spanishOptionsElement.querySelectorAll("li");
  opts.forEach((li,i)=>{
    li.classList.remove("correct","wrong");
    if (i===q.answer) li.classList.add("correct");
    else if (i===sel) li.classList.add("wrong");
    li.style.pointerEvents="none";
  });
  if (sel===q.answer) { spanishScore++; spanishScoreElement.textContent=spanishScore; }
  else spanishErrors.push(`Pregunta: ${q.question} - Respuesta: ${q.options[q.answer]}`);
  setTimeout(()=>{
    currentSpanishQuestion++; loadSpanishQuestion();
  },1500);
}
function endSpanishQuiz() {
  stopSpanishTimer();
  spanishQuizContainer.style.display="none";
  spanishEndScreen.style.display="block";
  spanishFinalMessageEl.textContent = `Puntuación Final: ${spanishScore}/${spanishQuestions.length} | Tiempo: ${spanishTimer}s`;
  spanishErrorListEl.innerHTML = spanishErrors.map(e=>`
    <li class="error-item">
      ${e}<br>
      <button class="aprenda-mais-button" onclick="showLibrarySectionSpanish()">Aprenda Mais</button>
    </li>
  `).join("");
}
window.showLibrarySectionSpanish = function() {
  hideAllSections();
  spanishLibraryContainer.style.display="block";
}
btnSpanish.addEventListener("click", ()=>{ hideAllSections(); spanishMenuContainer.style.display="block"; });
btnSpanishQuiz.addEventListener("click", ()=>{
  hideAllSections(); spanishQuizContainer.style.display="block";
  spanishQuestions = getRandomSpanishQuestions();
  spanishScore=0; currentSpanishQuestion=0; spanishErrors=[];
  spanishScoreElement.textContent=spanishScore;
  startSpanishTimer(); loadSpanishQuestion();
});
btnSpanishLibrary.addEventListener("click", ()=>{ hideAllSections(); spanishLibraryContainer.style.display="block"; });
backButtonSpanishMenu.addEventListener("click", backToMenu);
spanishRestartButton.addEventListener("click", ()=>{
  btnSpanishQuiz.click();
});
spanishMenuButton.addEventListener("click", backToMenu);

// --- QUIZ FRANÇAIS ---
let frenchQuestions = [], frenchScore = 0, currentFrenchQuestion = 0, frenchErrors = [], frenchTimer = 0, frenchTimerInterval;
function getRandomFrenchQuestions() {
  const all = [
    { question: "Comment dit-on 'Hello' en français?", options:["Bonjour","Au revoir","Merci","S'il vous plaît"], answer:0 },
    { question: "Que signifie 'Goodbye' en français?", options:["Bonjour","Au revoir","Bonne nuit","Merci"], answer:1 },
    { question: "Comment dit-on 'Thank you' en français?", options:["S'il vous plaît","Merci","De rien","Pardon"], answer:1 },
    { question: "Quel est le pluriel de 'ami'?", options:["Amis","Amies","Amis","Ami(e)s"], answer:0 },
    { question: "Comment dit-on 'I am learning French' en français?", options:["J'apprends le français","Je français apprends","J'apprendrai le français","Je suis en train d'apprendre le français"], answer:0 }
  ];
  return [...all].sort(()=>Math.random()-0.5).slice(0,15);
}
function startFrenchTimer() {
  frenchTimer=0; frenchTimerElement.textContent=frenchTimer;
  clearInterval(frenchTimerInterval);
  frenchTimerInterval=setInterval(()=>{
    frenchTimer++; frenchTimerElement.textContent=frenchTimer;
  },1000);
}
function stopFrenchTimer(){ clearInterval(frenchTimerInterval); }
function loadFrenchQuestion() {
  if (currentFrenchQuestion < frenchQuestions.length) {
    const q = frenchQuestions[currentFrenchQuestion];
    frenchQuestionElement.textContent = q.question;
    frenchOptionsElement.innerHTML = "";
    q.options.forEach((opt,i)=>{
      const li=document.createElement("li");
      li.textContent=opt;
      li.addEventListener("click", ()=> frenchCheckAnswer(i));
      frenchOptionsElement.appendChild(li);
    });
  } else endFrenchQuiz();
}
function frenchCheckAnswer(sel) {
  const q=frenchQuestions[currentFrenchQuestion];
  const opts=frenchOptionsElement.querySelectorAll("li");
  opts.forEach((li,i)=>{
    li.classList.remove("correct","wrong");
    if (i===q.answer) li.classList.add("correct");
    else if (i===sel) li.classList.add("wrong");
    li.style.pointerEvents="none";
  });
  if (sel===q.answer) { frenchScore++; frenchScoreElement.textContent=frenchScore; }
  else frenchErrors.push(`Question: ${q.question} - Réponse: ${q.options[q.answer]}`);
  setTimeout(()=>{
    currentFrenchQuestion++; loadFrenchQuestion();
  },1500);
}
function endFrenchQuiz() {
  stopFrenchTimer();
  frenchQuizContainer.style.display="none";
  frenchEndScreen.style.display="block";
  frenchFinalMessageEl.textContent = `Score Final: ${frenchScore}/${frenchQuestions.length} | Temps: ${frenchTimer}s`;
  frenchErrorListEl.innerHTML = frenchErrors.map(e=>`
    <li class="error-item">
      ${e}<br>
      <button class="aprenda-mais-button" onclick="showLibrarySectionFrench()">En savoir plus</button>
    </li>
  `).join("");
}
window.showLibrarySectionFrench = function() {
  hideAllSections();
  frenchLibraryContainer.style.display="block";
}
btnFrench.addEventListener("click", ()=>{ hideAllSections(); frenchMenuContainer.style.display="block"; });
btnFrenchQuiz.addEventListener("click", ()=>{
  hideAllSections(); frenchQuizContainer.style.display="block";
  frenchQuestions = getRandomFrenchQuestions();
  frenchScore=0; currentFrenchQuestion=0; frenchErrors=[];
  frenchScoreElement.textContent=frenchScore;
  startFrenchTimer(); loadFrenchQuestion();
});
btnFrenchLibrary.addEventListener("click", ()=>{ hideAllSections(); frenchLibraryContainer.style.display="block"; });
backButtonFrenchMenu.addEventListener("click", backToMenu);
frenchRestartButton.addEventListener("click", ()=> btnFrenchQuiz.click());
frenchMenuButton.addEventListener("click", backToMenu);

// --- SALVAR PONTUAÇÃO ---
async function saveScore(userName, score, time) {
  const snap = await getDocs(collection(db,"users"));
  let userDoc = null;
  snap.forEach(doc=>{
    if (doc.data().name === userName) userDoc = doc.ref;
  });
  if (userDoc) {
    await updateDoc(userDoc, { score, time });
  }
}

// Alterna a visualização do conteúdo da Biblioteca (expansível)
document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll(".text-card .text-header");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      content.classList.toggle("active");
    });
  });
});

// Lista de perguntas fixa
const allQuestions = [
  { question: "What is 'eu sou estudante' in English?", options: ["I am student", "A student I am", "I student am", "I am a student"], answer: 3, difficulty: "easy", libraryRef: "frases-basicas" },
  { question: "Which one is correct?", options: ["Pizza do you like?", "Do you like pizza?", "Like pizza you?", "You pizza like?"], answer: 1, difficulty: "easy", libraryRef: "frases-basicas" },
  { question: "What does 'I am learning English' mean?", options: ["Eu aprendi inglês", "Eu estou aprendendo inglês", "Eu ensino inglês", "Eu amo inglês"], answer: 1, difficulty: "medium", libraryRef: "frases-basicas" },
  { question: "How do you say 'Onde você mora?' in English?", options: ["Where do you live?", "Where is you live?", "Where you live?", "Where are you living?"], answer: 0, difficulty: "medium", libraryRef: "frases-basicas" },
  { question: "What is the plural of 'child'?", options: ["Children", "Childs", "Childes", "Childern"], answer: 0, difficulty: "hard", libraryRef: "verbos" },
  { question: "How do you say 'bom dia' in English?", options: ["Good night", "Good morning", "Hello", "Good evening"], answer: 1, difficulty: "easy", libraryRef: "greetings" },
  { question: "What is the past tense of 'go'?", options: ["Going", "Went", "Gone", "Go"], answer: 1, difficulty: "easy", libraryRef: "verbos" },
  { question: "Which sentence is correct?", options: ["He doesn't likes apples", "He don't like apples", "He like apples", "He doesn't like apples"], answer: 3, difficulty: "medium", libraryRef: "grammar" },
  { question: "What does 'break a leg' mean?", options: ["Run fast", "Don't trip", "Break your leg", "Good luck"], answer: 3, difficulty: "medium", libraryRef: "idioms" },
  { question: "How do you say 'obrigado' in English?", options: ["Thanks", "Hello", "Sorry", "Please"], answer: 0, difficulty: "easy", libraryRef: "greetings" },
  { question: "Which is the correct form of the verb 'to be' for 'they'?", options: ["are", "am", "is", "be"], answer: 0, difficulty: "easy", libraryRef: "verbos" },
  { question: "What does 'How old are you?' mean?", options: ["Como você está?", "Onde você mora?", "Qual é o seu nome?", "Quantos anos você tem?"], answer: 3, difficulty: "medium", libraryRef: "frases-basicas" },
  { question: "How do you say 'Estou com fome' in English?", options: ["I'm cold", "I'm tired", "I'm happy", "I'm hungry"], answer: 3, difficulty: "medium", libraryRef: "frases-basicas" },
  { question: "What is the past tense of 'eat'?", options: ["Eating", "Eated", "Ate", "Eat"], answer: 2, difficulty: "hard", libraryRef: "verbos" },
  { question: "Which one is a correct question?", options: ["What it is time?", "What is time it?", "It is what time?", "What time is it?"], answer: 3, difficulty: "medium", libraryRef: "grammar" },
  { question: "What does 'It's raining cats and dogs' mean?", options: ["Está chovendo pouco", "Animais estão caindo", "Chuva de gatos", "Está chovendo muito"], answer: 3, difficulty: "hard", libraryRef: "idioms" },
  { question: "How do you say 'Estou cansado' in English?", options: ["I'm sad", "I'm bored", "I'm tired", "I'm sleepy"], answer: 2, difficulty: "easy", libraryRef: "frases-basicas" },
  { question: "What is the opposite of 'hot'?", options: ["Boiling", "Cool", "Cold", "Warm"], answer: 2, difficulty: "easy", libraryRef: "vocabulary" },
  { question: "Which sentence uses the present continuous?", options: ["I am eating", "I eat now", "I eats", "I will eat"], answer: 0, difficulty: "medium", libraryRef: "grammar" },
  { question: "What is the plural of 'mouse'?", options: ["Mices", "Mice", "Mouse", "Mouses"], answer: 1, difficulty: "hard", libraryRef: "vocabulary" },
  { question: "How do you say 'Qual é o seu nome?' in English?", options: ["What is your name?", "How are you?", "Where are you from?", "Who are you?"], answer: 0, difficulty: "easy", libraryRef: "frases-basicas" },
  { question: "Which one is a verb?", options: ["Run", "Fast", "Blue", "Happy"], answer: 0, difficulty: "easy", libraryRef: "verbos" },
  { question: "Complete: She ___ going to school.", options: ["be", "is", "am", "are"], answer: 1, difficulty: "medium", libraryRef: "grammar" },
  { question: "What does 'piece of cake' mean?", options: ["Um pedaço de bolo", "Algo caro", "Muito fácil", "Muito difícil"], answer: 2, difficulty: "hard", libraryRef: "idioms" },
  { question: "How do you say 'Eu não entendo' in English?", options: ["Not I understand", "I understand not", "I don't understand", "I no understand"], answer: 2, difficulty: "easy", libraryRef: "frases-basicas" },
  { question: "What is the opposite of 'early'?", options: ["Now", "Fast", "Soon", "Late"], answer: 3, difficulty: "medium", libraryRef: "vocabulary" },
  { question: "Which is a correct negative sentence?", options: ["She no likes coffee", "She doesn't like coffee", "She don't like coffee", "She not like coffee"], answer: 1, difficulty: "medium", libraryRef: "grammar" },
  { question: "How do you say 'Eu gosto de música' in English?", options: ["I like music", "I like of music", "I music like", "I likes music"], answer: 0, difficulty: "easy", libraryRef: "frases-basicas" },
  { question: "What is the correct past tense of 'have'?", options: ["Haved", "Has", "Had", "Have"], answer: 2, difficulty: "medium", libraryRef: "verbos" },
];

// ========================
// --- LEARNING TRACK (INGLÊS) ---
// ========================

// Dados das lições
const lessonsData = {
  1: {
    title: "Section 1 - Unit 1",
    content: `
      <h2>Welcome to Section 1 - Unit 1</h2>
      <p>In this unit, you'll learn the basics of the English language. Read the text below:</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vivamus vitae nisl vel metus dignissim fermentum.</p>
      <p><strong>Exercise 1:</strong> Write one short sentence summarizing what you understood.</p>
      <textarea id="exercise1" rows="3" style="width:100%;"></textarea>
      <p><strong>Quiz:</strong></p>
      <p>1) What is the capital of the United Kingdom?</p>
      <div>
        <input type="radio" name="q1" value="London"> London<br/>
        <input type="radio" name="q1" value="Paris"> Paris<br/>
        <input type="radio" name="q1" value="New York"> New York<br/>
      </div>
    `,
    unlocked: true,
    completed: false
  },
  2: {
    title: "Section 1 - Unit 2",
    content: `
      <h2>Section 1 - Unit 2</h2>
      <p>This unit deepens your understanding of basic vocabulary and sentence structure.</p>
      <p>Please read the text carefully:</p>
      <p>Donec aliquet, velit vel mattis tincidunt, sapien sapien ultrices libero, a dignissim libero nisi ac neque.</p>
      <p><strong>Exercise:</strong> Describe one new concept you learned from Unit 1.</p>
      <textarea id="exercise2" rows="3" style="width:100%;"></textarea>
      <p><strong>Quiz:</strong></p>
      <p>1) How many vowels are there in the English alphabet?</p>
      <div>
        <input type="radio" name="q2" value="5"> 5<br/>
        <input type="radio" name="q2" value="6"> 6<br/>
        <input type="radio" name="q2" value="7"> 7<br/>
      </div>
    `,
    unlocked: false,
    completed: false
  },
  3: {
    title: "Section 2 - Unit 1",
    content: `
      <h2>Section 2 - Unit 1</h2>
      <p>Welcome to an advanced unit, where we'll discuss idiomatic expressions and language nuances.</p>
      <p>Please review the text below:</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
      <p><strong>Exercise:</strong> Write a brief summary of what you have learned so far.</p>
      <textarea id="exercise3" rows="3" style="width:100%;"></textarea>
      <p><strong>Quiz:</strong></p>
      <p>1) Which of the following is an English idiom?</p>
      <div>
        <input type="checkbox" name="q3" value="Break a leg"> Break a leg<br/>
        <input type="checkbox" name="q3" value="Piece of cake"> Piece of cake<br/>
        <input type="checkbox" name="q3" value="Cold turkey"> Cold turkey<br/>
        <input type="checkbox" name="q3" value="Over the moon"> Over the moon<br/>
      </div>
    `,
    unlocked: false,
    completed: false
  },
};

// Carrega progresso do usuário (usando localStorage)
let userProgress = JSON.parse(localStorage.getItem("userProgress")) || {
  1: { unlocked: true, completed: false },
  2: { unlocked: false, completed: false },
  3: { unlocked: false, completed: false }
};

const lessonBubbles = document.querySelectorAll("#learning-track-container .lesson-bubble");
const modal = document.getElementById("lessonModal");
const lessonContentDiv = document.getElementById("lessonContent");
const closeButton = document.querySelector("#lessonModal .close-button");
const completeLessonBtn = document.getElementById("completeLessonBtn");

function updateBubblesUI() {
  lessonBubbles.forEach(bubble => {
    const lessonId = bubble.getAttribute("data-lesson-id");
    if (userProgress[lessonId].unlocked) {
      bubble.classList.remove("locked");
      bubble.querySelector(".lesson-status").textContent = userProgress[lessonId].completed
        ? "Completed"
        : "Start";
    } else {
      bubble.classList.add("locked");
      bubble.querySelector(".lesson-status").textContent = "Locked";
    }
  });
}

// Configura clique nas bolhas das lições
lessonBubbles.forEach(bubble => {
  bubble.addEventListener("click", function() {
    const lessonId = this.getAttribute("data-lesson-id");
    if (!userProgress[lessonId].unlocked) return;
    const data = lessonsData[lessonId];
    lessonContentDiv.innerHTML = data.content;
    modal.style.display = "block";
    completeLessonBtn.setAttribute("data-current-lesson", lessonId);
  });
});

// Fecha o modal
closeButton.addEventListener("click", function() {
  modal.style.display = "none";
});
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Ao concluir a lição
completeLessonBtn.addEventListener("click", function() {
  const currentLessonId = this.getAttribute("data-current-lesson");
  userProgress[currentLessonId].completed = true;
  const nextLessonId = parseInt(currentLessonId) + 1;
  if (userProgress[nextLessonId]) {
    userProgress[nextLessonId].unlocked = true;
  }
  localStorage.setItem("userProgress", JSON.stringify(userProgress));
  updateBubblesUI();
  modal.style.display = "none";
});

// Listener para exibir a Learning Track
btnLearning.addEventListener("click", () => {
  hideAllSections();
  learningTrackContainer.style.display = "block";
  updateBubblesUI();
});



document.addEventListener("DOMContentLoaded", () => {
  const registerContainer = document.getElementById("register-container");
  const menuContainer = document.getElementById("menu-container");
  const startButton = document.getElementById("start-button");

  // Evento de clique no botão de cadastro
  startButton.addEventListener("click", () => {
    const nameInput = document.getElementById("name").value.trim();
    const passwordInput = document.getElementById("register-password").value.trim();

    // Verifica se os campos estão preenchidos
    if (nameInput && passwordInput) {
      // Oculta a tela de cadastro
      registerContainer.style.display = "none";

      // Exibe o menu principal
      menuContainer.style.display = "block";
    } else {
      alert("Por favor, preencha todos os campos antes de continuar.");
    }
  });

  // Alternar entre cadastro e login
  const goLoginLink = document.getElementById("go-login");
  const loginContainer = document.getElementById("login-container");
  const goRegisterLink = document.getElementById("go-register");

  goLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });

  goRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  });
});
}

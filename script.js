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
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const quizContainer = document.getElementById("quiz-container");
const endScreen = document.getElementById("end-screen");
const finalMessageElement = document.getElementById("final-message");
const errorListElement = document.getElementById("error-list");
const restartButton = document.getElementById("restart-button");
const progressBar = document.querySelector(".progress");
const timerContainer = document.getElementById("timer-container");

// Array de perguntas
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

// Função para pegar perguntas aleatórias
function getRandomQuestions() {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
}

// Evento de cadastro
document.getElementById("register-button").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

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
      document.getElementById("register-container").style.display = "none";
      document.getElementById("main-container").style.display = "block";
      startQuiz();
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
    }
  } else {
    alert("Preencha todos os campos!");
  }
});

// Função para iniciar o quiz
function startQuiz() {
  isQuizActive = true;
  timeLeft = 60;
  document.getElementById("timer").textContent = timeLeft;
  timerContainer.classList.remove("hidden");
  questions = getRandomQuestions();
  score = 0;
  currentQuestion = 0;
  errors = [];
  updateScore();

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);

  loadQuestion();
}

// Função para carregar perguntas
function loadQuestion() {
  const progress = (currentQuestion / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  
  if (currentQuestion < questions.length) {
    const
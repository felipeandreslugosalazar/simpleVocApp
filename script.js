import { words } from "./assets/js/dicsHelper.js";

let startButton = document.getElementById('start-button');
// let index = Math.floor(Math.random() * words.length);
let index = 0;

function start() {
  startButton.addEventListener('click', () => {

    changeWelcomeText();
    showContentWord();
    hideStartButton();
    showNavigation();
    showWords();
    enableNavigation();
  })
}

function changeWelcomeText() {
  const welcomeText = document.getElementById('title-welcome');
  // welcomeText.innerHTML = 'Let\'s learn a <br>German Word !';
  welcomeText.innerHTML = '';
}

function showContentWord() {
  const contentWord = document.getElementById('content-word');
  contentWord.style.visibility = 'visible';
}

function hideStartButton() {
  // startButton.style.visibility = 'hidden';
  startButton.style.display = 'none';
}

function showNavigation() {
  const navContainer = document.getElementById('navContainer');
  navContainer.style.visibility = 'visible';
}

function remapWord(array) {
  // ["article", "word", "plural", "translation", "example", "categorie", "level"], TelcA1.1
  // ["das", "Wort", "Wörter", "palabra", "Das ist ein deutsches Wort.", "Lektion 1: Hallo! Wie geht's?", "level"]

  const obj = {
    article: array[0] !== "-" ? `(${array[0]})` : "",
    word: array[1] !== "-" ? `${array[1]}` : "",
    plural: array[2] !== "-" ? `${array[2]}` : "",
    translation: array[3] !== "-" ? `${array[3]}` : "",
    example: array[4] !== "-" ? `${array[4]}` : "",
    categorie: array[5] !== "-" ? `${array[5]}` : "",
    level: array[6] !== "-" ? `- ${array[6]}` : "",
  };

  return obj;
}

function showWords() {

  const currentWord = words[index];
  // document.getElementById('words').innerHTML = currentWord;

  const remappedWord = remapWord(currentWord);

  const article = remappedWord.article;
  const word = remappedWord.word;
  const plural = remappedWord.plural;
  const translation = remappedWord.translation;
  const example = remappedWord.example;
  const categorie = remappedWord.categorie;
  const level = remappedWord.level;

  const Index = document.getElementById("index");
  Index.innerHTML = index + 1; //show 1st index as 1 not 0

  const Article = document.getElementById("article");
  Article.innerHTML = article;
  const Word = document.getElementById("word");
  Word.innerHTML = word;
  const Plural = document.getElementById("plural");
  const ArticlePlural = document.getElementById("articlePlural");
  if (plural == "") {
    ArticlePlural.style.visibility = "hidden";
    Plural.style.visibility = "hidden";
  }
  else {
    ArticlePlural.style.visibility = "visible";
    Plural.style.visibility = "visible";
    Plural.innerHTML = plural;
  }
  const Translation = document.getElementById("translation");
  Translation.innerHTML = translation;
  const Example = document.getElementById("example");
  Example.innerHTML = example;
  const Level = document.getElementById("level");
  Level.innerHTML = level;

  const Categorie = document.getElementById("categorie");
  Categorie.innerHTML = categorie;
}

function enableNavigation() {
  const previousButton = document.getElementById('previous-button');
  const nextButton = document.getElementById('next-button');
  const randomButton = document.getElementById('random-button');

  previousButton
    .addEventListener("click", () => {
      index = (index - 1 + words.length) % words.length;
      showWords();
    });

  nextButton
    .addEventListener("click", () => {
      index = (index + 1 + words.length) % words.length;
      showWords();
    });

  randomButton
    .addEventListener("click", () => {
      index = Math.floor(Math.random() * words.length);
      showWords();
    });
}

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
      .then(reg => {
        console.log("✅ SW registered at scope:", reg.scope);

        // Comprobar si ya hay un SW activo o esperar a que se active
        if (navigator.serviceWorker.controller) {
          // Ya hay un SW controlando la página
          start();
        } else {
          // Esperar a que el SW tome control (evento controllerchange)
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("Service Worker is now controlling the page");
            start();
          });
        }
      })
      .catch(err => console.error("❌ Error registering Service Worker:", err));
  } else {
    // No hay soporte para SW, igual arrancamos la app
    start();
  }
});
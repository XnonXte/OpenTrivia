const startButton = document.getElementById("start-btn");
const startParagraph = document.getElementById("start-paragraph");
const nextButton = document.getElementById("next-btn");
const questionContainerElement = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtonElement = document.getElementById("answer-buttons");
const correctGuessDisplay = document.getElementById("correct-guess");
const wrongGuessDisplay = document.getElementById("wrong-guess");
const endMessage = document.getElementById("end-message");

const questions = [];

let currentQuestionIndex, correctGuess, wrongGuess;

// Fetch questions data from opentdb.com API endpoint.
function getQuestions(callback) {
  fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((q) => {
        questions.push({
          question: q.question,
          // Shuffle the answers.
          answers: shuffleArray([
            { text: q.incorrect_answers[0], correct: false },
            { text: q.incorrect_answers[1], correct: false },
            { text: q.incorrect_answers[2], correct: false },
            { text: q.correct_answer, correct: true },
          ]),
        });
      });
      callback();
    });
}

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Event listener for both start button and next button.
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

// Function for starting the game.
// What it does is to create a random shuffled answers for each question.
// This will remove the 'hide' class off questionContainerElement where our question + answer elements are stored.
function startGame() {
  getQuestions(() => {
    startButton.classList.add("hide");
    startParagraph.classList.add("hide");
    endMessage.classList.add("hide");
    currentQuestionIndex = 0;
    correctGuess = 0;
    wrongGuess = 0;
    questionContainerElement.classList.remove("hide");
    setNextQuestion();
  });
}

// Setting up the next question by calling showQuestion and resetState for resetting the background color back to normal.
function setNextQuestion() {
  resetState();
  showQuestion(questions[currentQuestionIndex]);
}

// This will determine if the question is true or false.
function showQuestion(question) {
  questionElement.innerHTML = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer); // Processing the button when clicked.
    answerButtonElement.appendChild(button);
  });
}

// Resetting the state of the body element.
function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (answerButtonElement.firstChild) {
    answerButtonElement.removeChild(answerButtonElement.firstChild);
  }
}

// Check if the button clicked is true or false, iterate over the answerButtonElement.children
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);

  if (correct) {
    correctGuess++;
  } else {
    wrongGuess++;
  }

  Array.from(answerButtonElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
    button.disabled = true;
  });
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    // Restarting the quizz game if we ran out of questions.
    startButton.innerText = "Restart Trivia";
    startButton.classList.remove("hide");
    endMessage.classList.remove("hide");
    correctGuessDisplay.innerHTML = correctGuess.toString();
    wrongGuessDisplay.innerHTML = wrongGuess.toString();
  }
}

// Add the class 'correct' if correct or 'wrong' if wrong.
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

// Clearing the class after each question.
function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

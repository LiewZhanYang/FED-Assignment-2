// References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount = 0;
let scoreCount = 0;
let count = 10; // Adjusted to 10 to match "10s" initially displayed
let countdown;
let quizArray = []; // Will be filled with fetched data

// Fetch and setup quiz
document.addEventListener("DOMContentLoaded", function () {
  startButton.addEventListener("click", function () {
    startScreen.classList.add("hide");
    displayContainer.classList.remove("hide");
    initial();
  });

  document
    .getElementById("start-button")
    .addEventListener("click", function () {
      // Hide the question count display

      var nextButton = document.getElementById("next-button"); // Ensure this is the correct ID
      if (nextButton) {
        nextButton.style.display = "none";

        setTimeout(function () {
          nextButton.style.display = "block"; // Use 'inline', 'inline-block', or 'block', as appropriate
        }, 2000);
      }

      // Hide the timer display
      var timerDisplay = document.querySelector(".timer-div"); // Adjust selector as necessary
      if (timerDisplay) {
        timerDisplay.style.display = "none";

        setTimeout(function () {
          timerDisplay.style.display = "block"; // Use 'inline', 'inline-block', or 'block', as appropriate
        }, 2000);
      }

      // ...rest of your start button click handling code...
    });

  document.getElementById("continue").addEventListener("click", function () {
    // Hide the score container and show another part of your app
    scoreContainer.classList.add("hide");
    // For example, show the main menu again or move to a different part of your app
    mainMenu.classList.remove("hide"); // Assuming you have a mainMenu element to show
  });

  nextBtn.addEventListener("click", function () {
    handleNextQuestion();
  });
});

function initial() {
  fetchQuizData();
}

function fetchQuizData() {
  const APIKEY = "65b1d9dda2399ae3ac4d588e";
  const API_URL =
    "https://fedassignment2ccgame-ef3b.restdb.io/rest/pythonquestion";

  fetch(API_URL, {
    method: "GET",
    headers: {
      "x-apikey": APIKEY,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      quizArray = data.map((item) => ({
        question: item.question,
        options: JSON.parse(item.options),
        correct: item.answer,
      }));
      setupQuiz();
    })
    .catch((error) => console.error("Error loading quiz questions:", error));
}

function setupQuiz() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 10;
  clearInterval(countdown);
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

function timerDisplay() {
  timeLeft.textContent = `${count}s`;
  countdown = setInterval(() => {
    count--;
    timeLeft.textContent = `${count}s`;
    if (count <= 0) {
      clearInterval(countdown);
      handleNextQuestion();
    }
  }, 1000);
}

function quizCreator() {
  quizArray.forEach((item) => {
    // Iterate over each question in the quizArray
    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");

    let questionDiv = document.createElement("p");
    questionDiv.classList.add("question");
    questionDiv.textContent = item.question; // Set the question text
    div.appendChild(questionDiv); // Append the question to the div

    // Iterate over the options for the current question
    item.options.forEach((option) => {
      let button = document.createElement("button");
      button.classList.add("option-div");
      button.textContent = option; // Set the option text
      button.addEventListener("click", function () {
        checker(this, item.correct); // Add click event listener, passing the clicked option and the correct answer
      });
      div.appendChild(button); // Append the option button to the div
    });

    quizContainer.appendChild(div); // Append the div to the quiz container
  });
}

function quizDisplay(questionIndex) {
  let quizCards = document.querySelectorAll(".container-mid");
  quizCards.forEach((card) => card.classList.add("hide"));
  quizCards[questionIndex].classList.remove("hide");
  countOfQuestion.textContent = `${questionIndex + 1} of ${
    quizArray.length
  } Question`;
}

function checker(selectedOption, correctAnswer) {
  let options = selectedOption.parentNode.querySelectorAll(".option-div");
  options.forEach((option) => {
    option.disabled = true; // Disable all options once an option is selected
    if (option.textContent === correctAnswer.replace(/"/g, "")) {
      // remove additional quotes from correct answer
      option.classList.add("correct"); // Add 'correct' class to the correct option
    }
  });
  if (selectedOption.textContent === correctAnswer.replace(/"/g, "")) {
    scoreCount++; // Increment score if the selected option is correct
    selectedOption.classList.add("correct"); // Highlight the selected option if it's correct
  } else {
    selectedOption.classList.add("incorrect"); // Highlight the selected option if it's incorrect
    // Find the correct option and highlight it as well
    let correctOption = Array.from(options).find(
      (option) => option.textContent === correctAnswer.replace(/"/g, "")
    );
    if (correctOption) {
      correctOption.classList.add("correct");
    }
  }
  clearInterval(countdown); // Stop the timer
}

function handleNextQuestion() {
  questionCount++;
  if (questionCount < quizArray.length) {
    quizDisplay(questionCount);
    count = 10;
    clearInterval(countdown);
    timerDisplay();
  } else {
    displayResults();
  }
}

function displayResults() {
  console.log("Displaying results, scoreCount:", scoreCount); // Debugging line
  displayContainer.classList.add("hide");
  scoreContainer.classList.remove("hide");
  userScore.textContent = `Your score is ${scoreCount} out of ${quizArray.length}`;
}


window.onload = function () {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
  scoreContainer.classList.add("hide");
};

// Function to calculate the quiz score
// This is just a placeholder; you need to define how the score is calculated based on your quiz logic
function calculateScore() {
  // ... logic to calculate score based on answers ...
  return scoreCount; // Assuming scoreCount is the variable that holds the calculated score
}

// Function to display the score page
// This function will hide the quiz and show the score results
function displayScorePage(score) {
  // Assuming you have HTML elements with IDs 'quiz' and 'scorePage' respectively
  document.getElementById("quiz").style.display = "none"; // Hide the quiz
  document.getElementById("scorePage").style.display = "block"; // Show the score page

  // Update the score display
  document.getElementById(
    "userScore"
  ).textContent = `Your score is ${score} out of ${quizArray.length}`;
}

function finishQuiz() {
  // Calculate the score
  let score = calculateScore(); // Your function that calculates the score

  // Store the score in localStorage
  localStorage.setItem(score);

  // Display the score page
  displayScorePage(score); // Your function that displays the score page
}

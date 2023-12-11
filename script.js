("use strict");

// Initialize scores and winning condition
let userScore = 0;
let computerScore = 0;
let winCondition = 5;
let roundNumber = 0;
let userOverallWins = 0;
let computerOverallWins = 0;
let selectedRoundButton = null;
let userName = ""; // Global variable to store the user's name

// Select DOM elements: Rock, Paper, Scissors buttons, result display, and Play Again button
let rockButton = document.querySelector("#rockButton");
let paperButton = document.querySelector("#paperButton");
let scissorsButton = document.querySelector("#scissorsButton");
let resultDiv = document.querySelector("#result");
let playAgainButton = document.querySelector("#playAgainButton");
let userOverallScoreDisplay = document.querySelector("#userOverallScore");
let computerOverallScoreDisplay = document.querySelector(
  "#computerOverallScore"
);
let startGameButton = document.querySelector("#startGame");
document
  .querySelector("#bestOf3")
  .addEventListener("click", () => setWinConditionAndStart(3));
document
  .querySelector("#bestOf5")
  .addEventListener("click", () => setWinConditionAndStart(5));
document
  .querySelector("#bestOf7")
  .addEventListener("click", () => setWinConditionAndStart(7));

// Trigger the default game mode (e.g., Best of 5) on page load
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#bestOf5").click();
});
document.querySelector("#submitName").addEventListener("click", submitName);

// Attach click event listeners to each game option button
rockButton.addEventListener("click", () => playGame("rock"));
paperButton.addEventListener("click", () => playGame("paper"));
scissorsButton.addEventListener("click", () => playGame("scissors"));
startGameButton.addEventListener("click", startGame);

function submitName() {
  userName = document.querySelector("#userName").value.trim();
  if (userName) {
    document.querySelector("#displayName").textContent = userName; // Update the display name
    document.querySelector("#nameEntry").style.display = "none";
    document.querySelector("#gameArea").style.display = "block"; // Show the game area
  } else {
    alert("Please enter your name.");
  }
}

// Function to display the Play Again button and attach click event listener for game reset
function showPlayAgain() {
  playAgainButton.style.display = "block"; // Show the button
  playAgainButton.addEventListener("click", resetGame);
}

function setWinConditionAndStart(rounds) {
  if (selectedRoundButton) {
    selectedRoundButton.classList.remove("selected");
  }

  winCondition = Math.ceil(rounds / 2);
  selectedRoundButton = document.querySelector(`#bestOf${rounds}`);
  selectedRoundButton.classList.add("selected");

  resetGame();
}

// Function to reset the game state for a new game
// Function to reset the game state for a new game
function resetGame() {
  userScore = 0;
  computerScore = 0;
  roundNumber = 0;
  playAgainButton.style.display = "none"; // Hide the play again button
  resultDiv.innerHTML = ""; // Clear the result display
  document.querySelector("#historyList").innerHTML = ""; // Clear the history

  rockButton.disabled = false;
  paperButton.disabled = false;
  scissorsButton.disabled = false;
}

function updateOverallScoreDisplay() {
  userOverallScoreDisplay.textContent = userOverallWins;
  computerOverallScoreDisplay.textContent = computerOverallWins;
}

// Function to randomly generate the computer's game choice
function getComputerChoice() {
  let choices = ["rock", "paper", "scissors"];
  let randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

// Function to determine the winner of a round
function determineWinner(user, computer) {
  if (user === computer) {
    return "it's a tie!";
  } else if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  ) {
    userScore++;
    return "you win!";
  } else {
    computerScore++;
    return "you lose.";
  }
}

// Function to update the history display
function updateHistory(playerSelection, computerSelection, result) {
  let historyList = document.querySelector("#historyList");
  let newHistoryItem = document.createElement("li");
  newHistoryItem.textContent = `Round ${roundNumber}: User chose ${playerSelection}, Computer chose ${computerSelection} - ${result}`;
  historyList.appendChild(newHistoryItem);
}

// Main function to play the game
function playGame(playerSelection) {
  roundNumber++;
  let computerSelection = getComputerChoice();
  let result = determineWinner(playerSelection, computerSelection);

  // Update and display the round results in the result div
  resultDiv.innerHTML = `Round Result: ${result}<br>User chose: ${playerSelection}<br>Computer chose: ${computerSelection}<br>UserScore: ${userScore}, ComputerScore: ${computerScore}`;

  // Update the game history
  updateHistory(playerSelection, computerSelection, result);

  // Check if either player has reached the winning condition and end the game if so
  if (userScore === winCondition || computerScore === winCondition) {
    resultDiv.innerHTML += `<br><strong>Game Over! ${
      userScore === winCondition ? "You Win!" : "Computer Wins!"
    }</strong>`;
    // Disable game option buttons to prevent more rounds being played
    rockButton.disabled = true;
    paperButton.disabled = true;
    scissorsButton.disabled = true;

    // Increment overall score for the winner
    if (userScore === winCondition) {
      userOverallWins++;
    } else {
      computerOverallWins++;
    }

    updateOverallScoreDisplay(); // Update the overall score display

    // Show the Play Again button for restarting the game
    showPlayAgain();
  }
}

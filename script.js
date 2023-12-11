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
let playerMMR = 0;
let playerLevel = 1; // Initialize player level
const MMR_CHANGE = 25; // Example value, can be adjusted
let userWins = 0;
let userLosses = 0;
let userTies = 0;
let userChoices = { rock: 0, paper: 0, scissors: 0 };

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

document
  .querySelector("#userName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      submitName();
    }
  });

document
  .querySelector("#newUserName")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      changeName();
    }
  });

document.querySelector("#showChangeName").addEventListener("click", () => {
  document.querySelector("#changeNameSection").style.display = "block";
});

document
  .querySelector("#changeNameButton")
  .addEventListener("click", changeName);
function changeName() {
  const newUserName = document.querySelector("#newUserName").value.trim();
  if (newUserName) {
    // Optional: Transfer stats to the new username if desired
    // transferStats(userName, newUserName);

    // Update userName globally and in localStorage
    userName = newUserName;
    localStorage.setItem("currentUserName", userName);

    // Update displayed username
    document.querySelector("#displayName").textContent = userName;

    // Hide the change name section
    document.querySelector("#changeNameSection").style.display = "none";

    // Save new stats
    saveStats();
  } else {
    alert("Please enter a new name.");
  }
}

function transferStats(oldName, newName) {
  const oldStats = JSON.parse(localStorage.getItem(oldName));
  if (oldStats) {
    localStorage.setItem(newName, JSON.stringify(oldStats));
    localStorage.removeItem(oldName);
  }
}

// Trigger the default game mode (e.g., Best of 5) on page load
window.addEventListener("DOMContentLoaded", () => {
  let savedUserName = localStorage.getItem("currentUserName");
  if (savedUserName) {
    userName = savedUserName; // Set the global userName variable
    document.querySelector("#userName").value = savedUserName;
    submitName(); // This sets up the display name and game area
    loadStats(); // Load the stats for this user
  } else {
    // If no username is saved, trigger the default game mode
    document.querySelector("#bestOf5").click();
  }

  // Move displayMMR() and any other initialization inside the condition
  // where stats are successfully loaded to avoid overwriting them
  displayMMR(); // Initialize MMR display
});

document.querySelector("#submitName").addEventListener("click", submitName);

// Attach click event listeners to each game option button
rockButton.addEventListener("click", () => playGame("rock"));
paperButton.addEventListener("click", () => playGame("paper"));
scissorsButton.addEventListener("click", () => playGame("scissors"));

function submitName() {
  userName = document.querySelector("#userName").value.trim();
  if (userName) {
    localStorage.setItem("currentUserName", userName);
    loadStats(); // Load stats before setting up the game area
    document.querySelector("#displayName").textContent = userName;
    document.querySelector("#nameEntry").style.display = "none";
    document.querySelector("#gameArea").style.display = "block";
  } else {
    alert("Please enter your name.");
  }
}

function saveStats() {
  let stats = {
    userWins: userWins,
    userLosses: userLosses,
    userTies: userTies,
    userChoices: userChoices,
    userOverallWins: userOverallWins,
    userOverallLosses: computerOverallWins,
    playerMMR: playerMMR,
    playerLevel: playerLevel,
  };
  localStorage.setItem(userName, JSON.stringify(stats));
}

function loadStats() {
  let savedStats = JSON.parse(localStorage.getItem(userName));
  if (savedStats) {
    userWins = savedStats.userWins;
    userLosses = savedStats.userLosses;
    userTies = savedStats.userTies;
    userChoices = savedStats.userChoices;
    userOverallWins = savedStats.userOverallWins;
    computerOverallWins = savedStats.userOverallLosses;
    playerMMR = savedStats.playerMMR;
    playerLevel = savedStats.playerLevel;

    displayStats();
    displayMMR();
    updateOverallScoreDisplay();
    displayLevel();
  }
}

function updateLevel() {
  playerLevel = Math.floor(playerMMR / 100) + 1; // Calculate level based on experience
  displayLevel(); // Update level display
}

function displayLevel() {
  let levelDisplay = document.querySelector("#levelDisplay");
  levelDisplay.textContent = `Level: ${playerLevel}`;
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
  // Inside the resetGame function, to reset stats
  userWins = 0;
  userLosses = 0;
  userTies = 0;
  userChoices = { rock: 0, paper: 0, scissors: 0 };
  saveStats();
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
  userChoices[user]++; // Increment the user's choice count
  saveStats();

  if (user === computer) {
    userTies++;
    return "it's a tie!";
  } else if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  ) {
    userWins++;
    userScore++;
    return "you win!";
  } else {
    userLosses++;
    computerScore++;
    return "you lose.";
  }
}

function displayStats() {
  let statsDiv = document.querySelector("#stats"); // Make sure to add this element in your HTML
  statsDiv.innerHTML = `
      <p>Wins: ${userWins}</p>
      <p>Losses: ${userLosses}</p>
      <p>Ties: ${userTies}</p>
      <p>Rock: ${userChoices.rock}</p>
      <p>Paper: ${userChoices.paper}</p>
      <p>Scissors: ${userChoices.scissors}</p>
    `;
}

function updateMMR(playerWon) {
  if (playerWon) {
    playerMMR += MMR_CHANGE;
  } else {
    playerMMR = Math.max(0, playerMMR - MMR_CHANGE); // Prevent MMR from going below 0
  }
  displayMMR(); // Update the MMR display after each change
  updateLevel(); // Update player level
}

function displayMMR() {
  let mmrDisplay = document.querySelector("#mmrDisplay");
  mmrDisplay.textContent = `Your Experience: ${playerMMR}`;
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
  displayStats();
  roundNumber++;
  let computerSelection = getComputerChoice();
  let result = determineWinner(playerSelection, computerSelection);

  // Update and display the round results in the result div
  resultDiv.innerHTML = `Round Result: ${result}<br>User chose: ${playerSelection}<br>Computer chose: ${computerSelection}<br>UserScore: ${userScore}, ComputerScore: ${computerScore}`;

  // Update the game history
  updateHistory(playerSelection, computerSelection, result);

  // Check if either player has reached the winning condition and end the game if so
  if (userScore === winCondition || computerScore === winCondition) {
    // Update MMR based on match result
    updateMMR(userScore === winCondition);

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

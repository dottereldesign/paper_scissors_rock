("use strict");

// Variables
let userScore = 0;
let computerScore = 0;
let winCondition = 5;
let roundNumber = 0;
let userOverallWins = 0;
let computerOverallWins = 0;
let selectedRoundButton = null;
let userName = "";
let playerMMR = 0;
let playerLevel = 1;
const MMR_CHANGE = 25;
let userWins = 0;
let userLosses = 0;
let userTies = 0;
let userChoices = { rock: 0, paper: 0, scissors: 0 };
const choiceImages = {
  rock: "image/rock_large.png",
  paper: "image/paper_large.png",
  scissors: "image/scissors_large.png",
};
const choiceColors = {
  paper: "#a200ff",
  scissors: "#f8e800",
  rock: "#2cd3e1",
};
const winColor = "#75d521";
const loseColor = "#e00041";
const tieColor = "#e2e2e1";

// DOM
window.addEventListener("DOMContentLoaded", () => {
  let savedUserName = localStorage.getItem("currentUserName");
  if (savedUserName) {
    userName = savedUserName;
    document.querySelector("#userName").value = savedUserName;
    submitName();
    loadStats();
  }

  // Set Best of 3 as the default game type
  setWinConditionAndStart(3);
  document.querySelector("#bestOf3").classList.add("selected");

  displayMMR();
});

// Query Selectors
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
    userName = newUserName;
    localStorage.setItem("currentUserName", userName);

    document.querySelector("#displayName").textContent = userName;

    document.querySelector("#changeNameSection").style.display = "none";

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

document.querySelector("#submitName").addEventListener("click", submitName);

rockButton.addEventListener("click", () => playGame("rock"));
paperButton.addEventListener("click", () => playGame("paper"));
scissorsButton.addEventListener("click", () => playGame("scissors"));

function submitName() {
  userName = document.querySelector("#userName").value.trim();
  if (userName) {
    localStorage.setItem("currentUserName", userName);
    loadStats();
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

    displayMMR();
    displayLevel();
  }
}

function updateScoreDisplay() {
  document.querySelector("#userScoreDisplay").textContent = userScore;
  document.querySelector("#computerScoreDisplay").textContent = computerScore;
}

function updateLevel() {
  playerLevel = Math.floor(playerMMR / 100) + 1;
  displayLevel();
}

function displayLevel() {
  let levelDisplay = document.querySelector("#levelValue");
  levelDisplay.textContent = playerLevel;
}

function showPlayAgain() {
  playAgainButton.style.display = "block";
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

function resetGame() {
  userScore = 0;
  computerScore = 0;
  roundNumber = 0;
  userWins = 0;
  userLosses = 0;
  userTies = 0;
  userChoices = { rock: 0, paper: 0, scissors: 0 };
  saveStats();
  playAgainButton.style.display = "none";
  resultDiv.innerHTML = "";
  document.querySelector("#historyList").innerHTML = "";
  rockButton.disabled = false;
  paperButton.disabled = false;
  scissorsButton.disabled = false;

  // Update the score display elements
  document.getElementById("scoreUser").textContent = userScore;
  document.getElementById("scoreComputer").textContent = computerScore;

  // Reset the background colors and images if needed
  document.getElementById("scoreCardUser").style.backgroundColor = "";
  document.getElementById("scoreCardUser").innerHTML = "";
  document.getElementById("scoreCardComputer").style.backgroundColor = "";
  document.getElementById("scoreCardComputer").innerHTML = "";
}

function getComputerChoice() {
  let choices = ["rock", "paper", "scissors"];
  let randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

// function updateResultDisplay(gameResult) {
//   const resultText = `Round Result: ${gameResult.result}<br>User chose: ${gameResult.userChoice}<br>Computer chose: ${gameResult.computerChoice}<br>UserScore: ${userScore}, ComputerScore: ${computerScore}`;
//   resultDiv.innerHTML = resultText;
// }

function updateHistoryDisplay(gameResult) {
  let historyList = document.querySelector("#historyList");
  let newHistoryItem = document.createElement("li");
  newHistoryItem.textContent = `Round ${roundNumber}: User chose ${gameResult.userChoice}, Computer chose ${gameResult.computerChoice} - ${gameResult.result}`;
  historyList.appendChild(newHistoryItem);
}

function updateGameEndDisplay() {
  const endText = `<br><strong>Game Over! ${
    userScore === winCondition ? "You Win!" : "Computer Wins!"
  }</strong>`;
  resultDiv.innerHTML += endText;
}

function displayStats() {
  let statsDiv = document.querySelector("#stats");
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
    playerMMR = Math.max(0, playerMMR - MMR_CHANGE);
  }
  displayMMR();
  updateLevel();
}

function displayMMR() {
  let mmrDisplay = document.querySelector("#mmrValue");
  mmrDisplay.textContent = playerMMR;
}

function updateHistory(playerSelection, computerSelection, result) {
  let historyList = document.querySelector("#historyList");
  let newHistoryItem = document.createElement("li");
  newHistoryItem.textContent = `Round ${roundNumber}: User chose ${playerSelection}, Computer chose ${computerSelection} - ${result}`;
  historyList.appendChild(newHistoryItem);
}

function determineWinner(user, computer) {
  userChoices[user]++;

  if (user === computer) {
    userTies++;
    return { result: "tie", userChoice: user, computerChoice: computer };
  } else if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  ) {
    userWins++;
    userScore++;
    return { result: "win", userChoice: user, computerChoice: computer };
  } else {
    userLosses++;
    computerScore++;
    return { result: "loss", userChoice: user, computerChoice: computer };
  }
}

function playGame(playerSelection) {
  roundNumber++;

  let computerSelection = getComputerChoice();
  let gameResult = determineWinner(playerSelection, computerSelection);

  //   updateResultDisplay(gameResult);
  updateHistoryDisplay(gameResult);

  // Update the score display
  document.getElementById("scoreUser").textContent = userScore;
  document.getElementById("scoreComputer").textContent = computerScore;

  // Set background colors based on game result
  if (gameResult.result === "win") {
    document.getElementById("scoreCardUser").style.backgroundColor = winColor;
    document.getElementById("scoreCardComputer").style.backgroundColor =
      loseColor;
  } else if (gameResult.result === "loss") {
    document.getElementById("scoreCardUser").style.backgroundColor = loseColor;
    document.getElementById("scoreCardComputer").style.backgroundColor =
      winColor;
  } else {
    // in case of a tie
    document.getElementById("scoreCardUser").style.backgroundColor = tieColor;
    document.getElementById("scoreCardComputer").style.backgroundColor =
      tieColor;
  }

  // Update the images based on the choices
  document.getElementById(
    "scoreCardUser"
  ).innerHTML = `<img src="${choiceImages[playerSelection]}" alt="${playerSelection}" />`;
  document.getElementById(
    "scoreCardComputer"
  ).innerHTML = `<img src="${choiceImages[computerSelection]}" alt="${computerSelection}" />`;

  if (userScore === winCondition || computerScore === winCondition) {
    updateMMR(userScore === winCondition);
    updateGameEndDisplay();
    rockButton.disabled = true;
    paperButton.disabled = true;
    scissorsButton.disabled = true;

    if (userScore === winCondition) {
      userOverallWins++;
    } else {
      computerOverallWins++;
    }

    showPlayAgain();
    saveStats(); // Save stats when the game ends
  }
}

window.addEventListener("beforeunload", saveStats);

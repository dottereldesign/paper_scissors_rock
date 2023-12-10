"use strict";

let userScore = 0;
let computerScore = 0;
let winCondition = 5;

// 1. Get user input (Rock, Paper, or Scissors)
function getUserChoice() {
  let userInput = prompt("Choose Rock, Paper, or Scissors").toLowerCase();
  if (
    userInput === "rock" ||
    userInput === "paper" ||
    userInput === "scissors"
  ) {
    return userInput;
  } else {
    alert("Sorry, that is an invalid hand.");
    return getUserChoice();
  }
}

// 2. Generate computer choice (Rock, Paper, or Scissors)
function getComputerChoice() {
  let choice = ["rock", "paper", "scissors"];
  let randomizeChoice = Math.floor(Math.random() * 3);
  return choice[randomizeChoice];
}

// 3. Determine the winner
function determineWinner(user, computer) {
  if (user === computer) {
    return "it's a tie!";
  } else if (
    (user === "rock" && computer === "scissors") ||
    (user === "paper" && computer === "rock") ||
    (user === "scissors" && computer === "paper")
  ) {
    return "you win!";
  } else {
    return "you lose.";
  }
}

// 4. Play the game
function playGame() {
  for (let round = 1; round <= 9; round++) {
    let userChoice = getUserChoice();
    let computerChoice = getComputerChoice();
    if (determineWinner(userChoice, computerChoice).includes("win")) {
      userScore++;
    } else if (determineWinner(userChoice, computerChoice).includes("lose")) {
      computerScore++;
    }
    console.log("Round:", round);
    console.log("User:", userChoice);
    console.log("Computer:", computerChoice);
    console.log("Result:", determineWinner(userChoice, computerChoice));
    console.log("UserScore:", userScore, "ComputerScore", computerScore);

    if (userScore === winCondition || computerScore === winCondition) {
      break;
    }
  }
}

playGame();

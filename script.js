"use strict";

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
  } else {
    return "not a tie.";
  }
}

let userChoice = getUserChoice();
let computerChoice = getComputerChoice();

console.log("User:", userChoice);
console.log("Computer:", computerChoice);
console.log("Result", determineWinner(userChoice, computerChoice));

// 4. Play the game
function playGame() {}

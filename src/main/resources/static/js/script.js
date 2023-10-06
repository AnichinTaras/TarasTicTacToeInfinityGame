document.addEventListener("DOMContentLoaded", () => {
  let currentGame = null;

  // Function to set the grid-template-columns property based on size
  function setBoardSizeColumns(size) {
    const gameBoard = document.getElementById("game-board");
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  }

  // Function to create the game board
  function createGameBoard(size) {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    gameBoard.style.display = "grid";
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        gameBoard.appendChild(cell);
      }
    }
  }

  function makeMove(row, col) {
    fetch(`/api/game/move?row=${row}&col=${col}`, { method: "POST" })
      .then((response) => response.text())
      .then((message) => {
        updateGame();
        displayMessage(message);
      });
  }

  // Function to start a new game
  function startNewGame() {
    const sizeInput = document.getElementById("size-input");
    sizeInput.style.display = "block"; // Display the size input

    // Add an event listener to the "Submit" button
    const submitButton = document.getElementById("submit-size");
    submitButton.addEventListener("click", () => {
      const size = document.getElementById("board-size").value;
      if (size) {
        fetch(`/api/game/new?size=${size}`, { method: "POST" })
          .then(() => {
            setBoardSizeColumns(size); // Set the grid-template-columns
            createGameBoard(size); // Create the game board
            updateGame();
            sizeInput.style.display = "none"; // Hide the size input after starting the game
          });
      }
    });
  }

  // Function to restart the current game
  function restartGame() {
    fetch("/api/game/restart", { method: "POST" })
      .then(() => {
        updateGame();
      });
  }

  // Function to update the game board UI
  function updateGame() {
    fetch("/api/game/state")
      .then((response) => response.json())
      .then((gameState) => {
        currentGame = gameState;
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
          const row = cell.getAttribute("data-row");
          const col = cell.getAttribute("data-col");
          cell.textContent = gameState.board.board[row][col];
        });
      });
  }

  // Function to display game messages
  function displayMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
  }

  // Event listeners for buttons and game board cells
  document.getElementById("new-game").addEventListener("click", startNewGame);
  document.getElementById("restart-game").addEventListener("click", restartGame);

  document.getElementById("game-board").addEventListener("click", (event) => {
    if (currentGame && !currentGame.gameOver && event.target.classList.contains("cell")) {
      const row = event.target.getAttribute("data-row");
      const col = event.target.getAttribute("data-col");
      makeMove(row, col);
    }
  });

  // Initial setup: Hide the game board and size input
  document.getElementById("game-board").style.display = "none";
  document.getElementById("size-input").style.display = "none";
});

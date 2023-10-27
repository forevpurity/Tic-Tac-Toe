function Gameboard() {
  const board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;

  const checkCellExists = (r, c) => {
    return board[r][c];
  };

  const markCell = (r, c, player) => {
    if (!checkCellExists(r, c) && !checkGameOver())
      return (board[r][c] = player);
  };

  const checkGameOver = () => {
    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] &&
        board[0][i] == board[1][i] &&
        board[1][i] == board[2][i]
      )
        return board[0][i];
      if (
        board[i][0] &&
        board[i][0] == board[i][1] &&
        board[i][1] == board[i][2]
      )
        return board[i][0];
    }
    if (board[0][0] && board[0][0] == board[1][1] && board[1][1] == board[2][2])
      return board[0][0];
    if (board[0][2] && board[0][2] == board[1][1] && board[1][1] == board[2][0])
      return board[0][2];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) return false;
      }
    }
    return true;
  };

  return { markCell, checkGameOver, getBoard };
}

function GameController() {
  let player = "X";
  const board = Gameboard();
  let result = "";

  const getPlayer = () => player;

  const getResult = () => result;

  const playRound = (r, c) => {
    if (board.markCell(r, c, player)) player = player == "X" ? "O" : "X";

    const res = board.checkGameOver();
    if (res == "X") result = "Player X has won!";
    else if (res == "O") result = "Player O has won!";
    else if (res) result = "It's a draw!";
  };

  return { getResult, playRound, getPlayer, getBoard: board.getBoard };
}

function ScreenController() {
  let game = GameController();
  const notiDiv = document.querySelector(".noti");
  const boardDiv = document.querySelector(".board");
  const restartBtn = document.querySelector(".restartBtn");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const result = game.getResult();
    notiDiv.textContent = `Player ${game.getPlayer()}'s turn`;

    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.toggle("cell");
        cellDiv.dataset.row = r;
        cellDiv.dataset.col = c;
        cellDiv.textContent = cell;
        boardDiv.appendChild(cellDiv);
      });
    });

    if (result) notiDiv.textContent = result;
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.col;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  function restartBoard(e) {
    game = GameController();
    updateScreen();
  }
  restartBtn.addEventListener("click", restartBoard);

  updateScreen();
}

ScreenController();

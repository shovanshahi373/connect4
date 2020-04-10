const audio = document.querySelector(".myAudio");
const board = document.querySelector(".board");
const boardSize = document.querySelector(".board-size");
const players = document.querySelectorAll(".playerName");
// initializations
let turn;
let cells;
let k;
let rows;
let columns;
let player1;
let player2;
let id;
let total;
let coltotal;
let p1Name = players[0].value;
let p2Name = players[1].value;

function clickHandler() {
  id = null;
  // check if there is another chip ontop of this one
  const targetID = +this.getAttribute("data-id") + columns;
  const targetRow = +this.parentElement.dataset.row;
  if (
    cells[targetID] &&
    cells[targetID].classList.contains("taken") &&
    !this.classList.contains("taken")
  ) {
    audio.currentTime = 0;
    audio.play();
    const card = document.createElement("div");
    const val = -(50 + 100 * targetRow);
    card.style.transform = `translate(-50%,${val}%)`;
    card.style.animationDuration = targetRow + "s";
    this.classList.add("insertCard", "taken");
    id = setTimeout(() => {
      card.style.animationPlayState = "paused";
    }, 700);
    this.appendChild(card);
    if (turn === "1") {
      card.style.backgroundColor = "red";
      this.setAttribute("data-taggedBy", "1");
      if (checkForWin.call(this, "1"))
        return setTimeout(() => gameComplete(p1Name), 1000);
      if (checkColumn.call(this, "1"))
        return setTimeout(() => gameComplete(p2Name), 1000);
      turn = "2";
    } else {
      card.style.backgroundColor = "blue";
      this.setAttribute("data-taggedBy", "2");
      if (checkForWin.call(this, "2"))
        return setTimeout(() => gameComplete(2), 1000);
      if (checkColumn.call(this, "2"))
        return setTimeout(() => gameComplete(2), 1000);
      turn = "1";
    }
  }
}

function gameComplete(name) {
  alert(`the game is won by ${name}!`);
  id = null;
  board.style.pointerEvents = "none";
  board.style.opacity = "0.4";
}

function checkForWin(player) {
  return [...this.parentElement.children].some((child1) => {
    if (child1.nextElementSibling !== null) {
      if (
        child1.dataset.taggedby ===
          child1.nextElementSibling.dataset.taggedby &&
        child1.dataset.taggedby === player
      ) {
        total += 1;
        return total === 4;
      } else {
        total = 1;
      }
    }
  });
}

function checkColumn(player) {
  const colArr = [];
  colArr.push(this);
  let increasingIndex = +this.dataset.id + columns;
  let decreasingIndex = +this.dataset.id - columns;
  while (cells[increasingIndex] !== undefined) {
    colArr.push(cells[increasingIndex]);
    increasingIndex += columns;
  }
  while (cells[decreasingIndex] !== undefined) {
    colArr.push(cells[decreasingIndex]);
    decreasingIndex -= columns;
  }
  colArr.sort((child1, child2) => {
    return +child1.dataset.id - +child2.dataset.id;
  });
  return colArr.some((child, index) => {
    if (colArr[index + 1] && colArr[index + 1] !== null) {
      if (
        child.dataset.taggedby === colArr[index + 1].dataset.taggedby &&
        child.dataset.taggedby === player
      ) {
        coltotal += 1;
        return coltotal === 4;
      } else {
        coltotal = 1;
      }
    }
  });
}

function createBoard(rows, cols) {
  k = -1;
  board.children &&
    [...board.children].forEach((node) => board.removeChild(node));
  for (let i = 0; i < rows; i++) {
    const rowField = document.createElement("div");
    rowField.textContent;
    rowField.setAttribute("data-row", i + 1);
    for (let j = 0; j < cols; j++) {
      k++;
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-id", k);
      cell.addEventListener("click", clickHandler);
      if (i === rows - 1) cell.classList.add("taken");
      if (i === 0 && j === 0) cell.style.borderTopLeftRadius = "23px";
      if (i === 0 && j === cols - 1) cell.style.borderTopRightRadius = "23px";
      if (i === rows - 1 && j === 0) cell.style.borderBottomLeftRadius = "23px";
      if (i === rows - 1 && j === cols - 1)
        cell.style.borderBottomRightRadius = "23px";
      // cells.push(cell);
      rowField.appendChild(cell);
    }
    board.appendChild(rowField);
  }
}

players[0].addEventListener("change", (e) => {
  p1Name = e.target.value;
});
players[1].addEventListener("change", (e) => {
  p2Name = e.target.value;
});

boardSize.addEventListener("change", (e) => {
  coltotal = 1;
  total = 1;
  board.style.pointerEvents = "unset";
  board.style.opacity = "1";
  // const players = document.querySelectorAll(".playerName");
  player1 = players[0].dataset.pid;
  player2 = players[1].dataset.pid;
  rows = +e.target.value.split("X")[0];
  columns = +e.target.value.split("X")[1];
  if (player1 && player2) createBoard(rows, columns);
  turn = player1;
  cells = [...document.querySelectorAll(".cell")];
});

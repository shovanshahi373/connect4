const audio = document.querySelector(".myAudio");
const board = document.querySelector(".board");
const boardSize = document.querySelector(".board-size");
const players = document.querySelectorAll(".playerName");
const winner = document.querySelector(".winner");
const displayMsg = document.querySelector(".after-game");
const restart = document.querySelector(".btn-restart");
const pturn = document.querySelector(".player-turn");
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
let diaglefttotal;
let diagrighttotal;
let p1Name = players[0].value;
let p2Name = players[1].value;

function clickHandler() {
  id = null;
  // check if there is another chip ontop of this one
  const targetID = +this.getAttribute("data-id") + columns;
  const targetRow = +this.parentElement.dataset.row;
  if (
    (this.classList.contains("bottom") && !this.classList.contains("taken")) ||
    (cells[targetID] &&
      cells[targetID].classList.contains("taken") &&
      !this.classList.contains("taken"))
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
        return setTimeout(() => gameComplete(p1Name), 1000);
      if (checkDiagonalLeft.call(this, "1"))
        return setTimeout(() => gameComplete(p1Name), 1000);
      if (checkDiagonalRight.call(this, "1"))
        return setTimeout(() => gameComplete(p1Name), 1000);
      turn = "2";
      pturn.textContent = `turn of ${p2Name}`;
      pturn.style.color = "blue";
    } else {
      card.style.backgroundColor = "blue";
      this.setAttribute("data-taggedBy", "2");
      if (checkForWin.call(this, "2"))
        return setTimeout(() => gameComplete(p2Name), 1000);
      if (checkColumn.call(this, "2"))
        return setTimeout(() => gameComplete(p2Name), 1000);
      if (checkDiagonalLeft.call(this, "2"))
        return setTimeout(() => gameComplete(p2Name), 1000);
      if (checkDiagonalRight.call(this, "2"))
        return setTimeout(() => gameComplete(p2Name), 1000);
      turn = "1";
      pturn.textContent = `turn of ${p1Name}`;
      pturn.style.color = "red";
    }
  }
}

function gameComplete(name) {
  alert(`the winner is ${name}!`);
  id = null;
  board.style.pointerEvents = "none";
  board.style.backgroundColor = "rgba(255,255,255,0.3)";
  board.style.borderTopLeftRadius = "3vw";
  board.style.borderTopRightRadius = "3vw";
  board.style.borderBottomLeftRadius = "3vw";
  board.style.borderBottomRightRadius = "3vw";
  displayMsg.style.display = "block";
  winner.textContent = `Winner is ${name}!`;
  pturn.textContent = "";
}

restart.addEventListener("click", () => createBoard(rows, columns));

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

function checkDiagonalLeft(player) {
  const Rows = document.querySelectorAll("div[data-row]");
  const tid = +this.dataset.id;
  const topRightMostSlot = columns;
  const bottomLeftMostSlot = rows * (columns - 1) + 1;
  if (
    //top right 6 slots
    tid === topRightMostSlot ||
    tid === topRightMostSlot - 1 ||
    tid === 2 * topRightMostSlot ||
    tid === topRightMostSlot - 2 ||
    tid === 3 * topRightMostSlot ||
    tid === 2 * topRightMostSlot - 1 ||
    //bottom left 6 slots
    tid === bottomLeftMostSlot ||
    tid === bottomLeftMostSlot + 1 ||
    tid === bottomLeftMostSlot + 2 ||
    tid === bottomLeftMostSlot - topRightMostSlot ||
    tid === bottomLeftMostSlot - 2 * topRightMostSlot ||
    tid === bottomLeftMostSlot - (topRightMostSlot - 1)
  )
    return false;
  const diagArr = [];
  const currentRowIndex = +this.parentElement.dataset.row;
  diagArr.push(this);
  // console.log("current row index is " + currentRowIndex);

  let increasingRowIndex = currentRowIndex + 1;
  let increasingIndex = tid + (columns + 1);
  let decreasingIndex = tid - (columns + 1);
  let decreasingRowIndex = currentRowIndex - 1;
  while (Rows[increasingRowIndex - 1] !== undefined) {
    diagArr.push(
      Rows[increasingRowIndex - 1].children[increasingIndex % columns]
    );
    increasingRowIndex += 1;
    increasingIndex += 1;
  }
  while (Rows[decreasingRowIndex - 1] !== undefined) {
    if ((decreasingIndex + 1) % columns < decreasingIndex % columns) break;
    diagArr.push(
      Rows[decreasingRowIndex - 1].children[decreasingIndex % columns]
    );
    decreasingRowIndex -= 1;
    decreasingIndex -= 1;
  }
  // console.log(diagArr);
  return (
    diagArr
      // .sort((c1, c2) => +c1.dataset.id - +c2.dataset.id)
      .some((child, index) => {
        if (diagArr[index + 1] && diagArr[index + 1] !== null) {
          if (
            child.dataset.taggedby === diagArr[index + 1].dataset.taggedby &&
            child.dataset.taggedby === player
          ) {
            diaglefttotal += 1;
            return diaglefttotal === 4;
          } else {
            diaglefttotal = 1;
          }
        }
      })
  );
}

function checkDiagonalRight(player) {
  const Rowss = document.querySelectorAll("div[data-row]");
  const tid = +this.dataset.id;
  const topLeftMostSlot = 0;
  const bottomRightMostSlot = rows * columns - 1;
  // console.log(topLeftMostSlot);
  // console.log(bottomRightMostSlot);
  if (
    //top right 6 slots
    tid === topLeftMostSlot ||
    tid === topLeftMostSlot + 1 ||
    tid === topLeftMostSlot + columns ||
    tid === topLeftMostSlot + 2 ||
    tid === topLeftMostSlot + columns + 1 ||
    tid === topLeftMostSlot + 2 * columns ||
    //bottom left 6 slots
    tid === bottomRightMostSlot ||
    tid === bottomRightMostSlot - 1 ||
    tid === bottomRightMostSlot - 2 ||
    tid === bottomRightMostSlot - columns ||
    tid === bottomRightMostSlot - 2 * columns ||
    tid === bottomRightMostSlot - (columns + 1)
  )
    return false;

  const diagArr = [];
  const currentRowIndex = +this.parentElement.dataset.row;
  diagArr.push(this);
  console.log("current row index is " + currentRowIndex);

  let increasingRowIndex = currentRowIndex + 1;
  let increasingIndex = tid + (columns - 1);
  let decreasingIndex = tid - (columns - 1);
  let decreasingRowIndex = currentRowIndex - 1;
  while (Rowss[increasingRowIndex - 1] !== undefined) {
    if ((increasingIndex + 1) % columns < increasingIndex % columns) break;
    diagArr.push(
      Rowss[increasingRowIndex - 1].children[increasingIndex % columns]
    );
    increasingRowIndex += 1;
    increasingIndex -= 1;
  }
  while (Rowss[decreasingRowIndex - 1] !== undefined) {
    if (decreasingIndex % columns < (decreasingIndex - 1) % columns) break;
    diagArr.push(
      Rowss[decreasingRowIndex - 1].children[decreasingIndex % columns]
    );
    decreasingRowIndex -= 1;
    decreasingIndex += 1;
  }
  // console.log(diagArr);
  return (
    diagArr
      // .sort((c1, c2) => +c1.dataset.id - +c2.dataset.id)
      .some((child, index) => {
        if (diagArr[index + 1] && diagArr[index + 1] !== null) {
          if (
            child.dataset.taggedby === diagArr[index + 1].dataset.taggedby &&
            child.dataset.taggedby === player
          ) {
            diagrighttotal += 1;
            return diagrighttotal === 4;
          } else {
            diagrighttotal = 1;
          }
        }
      })
  );
}

function createBoard(rows, cols) {
  console.log("me is called");
  coltotal = 1;
  total = 1;
  diaglefttotal = 1;
  diagrighttotal = 1;
  board.style.pointerEvents = "unset";
  board.style.backgroundColor = "transparent";
  board.style.borderTopLeftRadius = "unset";
  board.style.borderTopRightRadius = "unset";
  board.style.borderBottomLeftRadius = "unset";
  board.style.borderBottomRightRadius = "unset";

  displayMsg.style.display = "none";
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
      if (i === rows - 1) cell.classList.add("bottom");
      if (i === 0 && j === 0) cell.style.borderTopLeftRadius = "3vw";
      if (i === 0 && j === cols - 1) cell.style.borderTopRightRadius = "3vw";
      if (i === rows - 1 && j === 0) cell.style.borderBottomLeftRadius = "3vw";
      if (i === rows - 1 && j === cols - 1)
        cell.style.borderBottomRightRadius = "3vw";
      // cells.push(cell);
      rowField.appendChild(cell);
    }
    board.appendChild(rowField);
  }
  turn = player1;
  cells = [...document.querySelectorAll(".cell")];
}

players[0].addEventListener("change", (e) => {
  p1Name = e.target.value.trim().replace(/\s/g, "");
});
players[1].addEventListener("change", (e) => {
  p2Name = e.target.value.trim().replace(/\s/g, "");
});

boardSize.addEventListener("change", (e) => {
  // const players = document.querySelectorAll(".playerName");
  player1 = players[0].dataset.pid;
  player2 = players[1].dataset.pid;
  rows = +e.target.value.split("X")[0];
  columns = +e.target.value.split("X")[1];
  if (player1 && player2) createBoard(rows, columns);
});

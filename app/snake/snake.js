
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const APPLE_DELAY_MILLISECONDS = 4000;
const SIMULATOR_DELAY_MILLISECONDS = 150;

const board = document.querySelector('#board');

let direction;
let snake;
let apples;

const host = '192.168.0.24';
const port = '81';
const table = new tabLED(host, port);

const pixelBuffer = new Uint32Array(BOARD_WIDTH * BOARD_HEIGHT);

const containsCell = (list, cellToCheck) => {
  for (let cell of list) {
    if (cellsEqual(cell, cellToCheck)) {
      return true;
    }
  }
  return false;
};

const removeCell = (list, cellToRemove) => {

  for (let i = 0; i < list.length; i++) {
    const cell = list[i];

    if (cellsEqual(cell, cellToRemove)) {
      list.splice(i, 1);
    }
  }
};

class Snake {

  constructor() {

    this._cells = [[0, 2], [0, 1], [0, 0]];
    this._cellsToAdd = 0;
  }

  move(direction) {

    const head = this.getHead();
    const newHead = head.slice();

    switch (direction) {
      case 'left':
        newHead[0] -= 1;
        break;
      case 'right':
        newHead[0] += 1;
        break;
      case 'up':
        newHead[1] -= 1;
        break;
      case 'down':
        newHead[1] += 1;
        break;
    }

    this._cells.unshift(newHead);

    if (this._cellsToAdd === 0) {

      const lastIndex = this._cells.length - 1;
      this._cells.splice(lastIndex, 1);
    }
    else {
      this._cellsToAdd--;
    }
  }

  grow() {
    this._cellsToAdd++;
  }

  getHead() {
    return this._cells[0];
  }

  getCells() {
    return this._cells;
  }

  coversCell(cellToCheck) {
    const cells = this.getCells();

    for (let cell of cells) {
      if (cellsEqual(cell, cellToCheck)) {
        return true;
      }
    }

    return false;
  }

}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      direction = 'left';
      break;
    case 'ArrowRight':
      direction = 'right';
      break;
    case 'ArrowUp':
      direction = 'up';
      break;
    case 'ArrowDown':
      direction = 'down';
      break;
  }
});

// from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const init = () => {
  snake = new Snake();
  direction = 'down';
  apples = [];
};

const cellsEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};

const checkCollisions = () => {
  const head = snake.getHead();
  const cells = snake.getCells();

  if (head[0] < 0 || head[0] >= BOARD_WIDTH ||
      head[1] < 0 || head[1] >= BOARD_HEIGHT) {
    return true;
  }

  // check for collisions with self
  for (let i = 1; i < cells.length; i++) {

    const cell = cells[i];
    if (cellsEqual(head, cell)) {
      return true;
    }
  }
};

const checkEatApples = () => {
  const head = snake.getHead();

  if (containsCell(apples, head)) {
    snake.grow();
    removeCell(apples, head);
    table.draw(pixelBuffer);
  }
};

const createRandomApple = () => {

  console.log("creating apple");

  while (true) {

    const randX = randInRange(0, BOARD_WIDTH);
    const randY = randInRange(0, BOARD_HEIGHT);

    const cell = [randX, randY];

    if (!snake.coversCell(cell) && !containsCell(apples, cell)) {
      apples.push(cell);
      break;
    }
  }
};

const simulate = () => {

  snake.move(direction);

  if (checkCollisions()) {
    init();
  }

  checkEatApples();

  //renderHtml();
  renderTable();
};

// TODO: don't create new elements every time.
const renderHtml = () => {

  // clear board
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  const table = document.createElement('table');
  board.appendChild(table);

  for (let j = 0; j < BOARD_HEIGHT; j++) {

    const row = document.createElement('tr');
    table.appendChild(row);

    for (let i = 0; i < BOARD_WIDTH; i++) {

      const cell = document.createElement('td');
      cell.style.width = CELL_WIDTH;
      cell.style.height = CELL_HEIGHT;

      if (snake.coversCell([i, j])) {
        cell.style.backgroundColor = 'SteelBlue';
      }
      else if (containsCell(apples, [i, j])) {
        cell.style.backgroundColor = 'Tomato';
      }
      else {
        cell.style.backgroundColor = 'LightGray';
      }

      row.appendChild(cell);
    }
  }
};

const renderTable = () => {

  pixelBuffer.fill(0xFFFFFF);

  for (let j = 0; j < BOARD_HEIGHT; j++) {
    for (let i = 0; i < BOARD_WIDTH; i++) {

      if (snake.coversCell([i, j])) {
        pixelBuffer[j*BOARD_WIDTH + i]  = 0x0000FF;
      }
      else if (containsCell(apples, [i, j])) {
        pixelBuffer[j*BOARD_WIDTH + i]  = 0xFF0000;
      }
      //else {
      //  pixelBuffer[j*BOARD_WIDTH + i]  = 0xFFFFFF;
      //}
    }
  }

  table.draw(pixelBuffer);

};

init();
setInterval(simulate, SIMULATOR_DELAY_MILLISECONDS);
setInterval(createRandomApple, APPLE_DELAY_MILLISECONDS);

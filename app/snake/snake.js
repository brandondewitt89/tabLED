
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const APPLE_DELAY_MILLISECONDS = 3000;
const SIMULATOR_DELAY_MILLISECONDS = 100;
const GROW_LENGTH = 2;

const COLOR_RED = 0X93527F;
const COLOR_GREEN = 0X7F9352;

const NUM_ZERO =  [ [0, 2], [0, 3], [0, 4], [1, 1], [1, 5], [2, 2], [2, 3], [2, 4] ];
const NUM_ONE =   [ [0, 2], [0, 5], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5] ];
const NUM_TWO =   [ [0, 1], [0, 4], [0, 5], [1, 1], [1, 3], [1, 5], [2, 2], [2, 5] ];
const NUM_THREE = [ [0, 1], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ];
const NUM_FOUR =  [ [0, 1], [0, 2], [0, 3], [1, 3], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ];
const NUM_FIVE =  [ [0, 1], [0, 2], [0, 3], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 3], [2, 4] ];
const NUM_SIX =   [ [0, 2], [0, 3], [0, 4], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 3], [2, 4], [2, 5] ];
const NUM_SEVEN = [ [0, 1], [0, 4], [0, 5], [1, 1], [1, 3], [2, 1], [2, 2] ];
const NUM_EIGHT = [ [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ];
const NUM_NINE =  [ [0, 1], [0, 2], [0, 3], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4] ];


const BOARD_COLOR = 0X3C2F2F;

const numPlayers = 1;
const INIT_TABLE = [
  {
    startCell: [0, 2],
    direction: 'down',
    bodyColor: 0x938552,
    scoreColor: 0x655208,
    player: 0
  },
  {
    startCell: [BOARD_WIDTH - 1, 2],
    direction: 'down',
    bodyColor: 0x936552,
    scoreColor: 0x652408,
    player:1
  },
];

const board = document.querySelector('#board');

const browserDisplay  = new BrowserDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

const display = new TableDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);


var appleColor = COLOR_RED;
var isPaused = true;


let apples;
let snakes = [];

const pixelBuffer = new Uint32Array(BOARD_WIDTH * BOARD_HEIGHT);
pixelBuffer.fill(0x00FFFF);

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

  constructor(bodyColor, scoreColor, startCell, direction, player) {

    this.direction = direction;
    this.bodyColor = bodyColor;
    this.scoreColor = scoreColor;
    this.player = player;

    this._nextMove = 'down';
    this._maxQueueLength = 3;

    this._cells = [
      startCell,
      [startCell[0], startCell[1] - 1],
      [startCell[0], startCell[1] - 2]
    ];
    this._cellsToAdd = 0;
    this.scoreCells = [];
  }


  setNextMove(direction) {

    let newDirection = direction;

    switch (direction) {
      case 'left':
        if (this.direction === 'right') {
          newDirection = this.direction;
        }
        break;
      case 'right':
        if (this.direction === 'left') {
          newDirection = this.direction;
        }
        break;
      case 'up':
        if (this.direction === 'down') {
          newDirection = this.direction;
        }
        break;
      case 'down':
        if (this.direction === 'up') {
          newDirection = this.direction;
        }
        break;
    }

    this._nextMove = newDirection;
  }

  updatePosition() {

    this._move(this._nextMove);
  }

  _move(direction) {

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

    this.direction = direction;

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
    this._cellsToAdd += GROW_LENGTH;
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

  convertScoreToCells(player) {

    const scoreString = this._cells.length.toString();

    if (player === 0) {
      for (let i = 0; i < scoreString.length; i++) {
        if (i === 0) {
          switch (scoreString[i]) {
			case '0':
              this.scoreCells = this.shiftScore(1, NUM_ZERO);
              break;
            case '1':
              this.scoreCells = this.shiftScore(1, NUM_ONE);
              break;
            case '2':
              this.scoreCells = this.shiftScore(1, NUM_TWO);
              break;
            case '3':
              this.scoreCells = this.shiftScore(1, NUM_THREE);
              break;
            case '4':
              this.scoreCells = this.shiftScore(1, NUM_FOUR);
              break;
            case '5':
              this.scoreCells = this.shiftScore(1, NUM_FIVE);
              break;
            case '6':
              this.scoreCells = this.shiftScore(1, NUM_SIX);
              break;
            case '7':
              this.scoreCells = this.shiftScore(1, NUM_SEVEN);
              break;
            case '8':
              this.scoreCells = this.shiftScore(1, NUM_EIGHT);
              break;
            case '9':
              this.scoreCells = this.shiftScore(1, NUM_NINE);
          }
        }
        else if (i === 1) {
          switch (scoreString[i]) {
            case '0':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_ZERO));
              break;
            case '1':
			  this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_ONE));
              break;
            case '2':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_TWO));
              break;
            case '3':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_THREE));
              break;
            case '4':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_FOUR));
              break;
            case '5':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_FIVE));
              break;
            case '6':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_SIX));
              break;
            case '7':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_SEVEN));
              break;
            case '8':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_EIGHT));
              break;
            case '9':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(5, NUM_NINE));
          }
        }
        else if (i === 2) {
          switch (scoreString[i]) {
            case '0':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_ZERO));
              break;
            case '1':
			  this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_ONE));
              break;
            case '2':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_TWO));
              break;
            case '3':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_THREE));
              break;
            case '4':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_FOUR));
              break;
            case '5':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_FIVE));
              break;
            case '6':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_SIX));
              break;
            case '7':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_SEVEN));
              break;
            case '8':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_EIGHT));
              break;
            case '9':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(9, NUM_NINE));
          }
        }
      }
    }
    else if (player === 1) {
      for (let i = 0; i < scoreString.length; i++) {
        if (i === 0) {
          switch (scoreString[scoreString.length - i - 1]) {
			case '0':
              this.scoreCells = this.shiftScore(28, NUM_ZERO);
              break;
            case '1':
              this.scoreCells = this.shiftScore(28, NUM_ONE);
              break;
            case '2':
              this.scoreCells = this.shiftScore(28, NUM_TWO);
              break;
            case '3':
              this.scoreCells = this.shiftScore(28, NUM_THREE);
              break;
            case '4':
              this.scoreCells = this.shiftScore(28, NUM_FOUR);
              break;
            case '5':
              this.scoreCells = this.shiftScore(28, NUM_FIVE);
              break;
            case '6':
              this.scoreCells = this.shiftScore(28, NUM_SIX);
              break;
            case '7':
              this.scoreCells = this.shiftScore(28, NUM_SEVEN);
              break;
            case '8':
              this.scoreCells = this.shiftScore(28, NUM_EIGHT);
              break;
            case '9':
              this.scoreCells = this.shiftScore(28, NUM_NINE);
          }
        }
        else if (i === 1) {
          switch (scoreString[scoreString.length - i - 1]) {
            case '0':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_ZERO));
              break;
            case '1':
			  this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_ONE));
              break;
            case '2':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_TWO));
              break;
            case '3':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_THREE));
              break;
            case '4':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_FOUR));
              break;
            case '5':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_FIVE));
              break;
            case '6':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_SIX));
              break;
            case '7':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_SEVEN));
              break;
            case '8':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_EIGHT));
              break;
            case '9':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(24, NUM_NINE));
          }
        }
        else if (i === 2) {
          switch (scoreString[scoreString.length - i - 1]) {
            case '0':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_ZERO));
              break;
            case '1':
			  this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_ONE));
              break;
            case '2':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_TWO));
              break;
            case '3':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_THREE));
              break;
            case '4':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_FOUR));
              break;
            case '5':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_FIVE));
              break;
            case '6':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_SIX));
              break;
            case '7':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_SEVEN));
              break;
            case '8':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_EIGHT));
              break;
            case '9':
              this.scoreCells = this.scoreCells.concat(this.shiftScore(20, NUM_NINE));
          }
        }
      }
    }
  };

  shiftScore(shiftBy, number) {
	let shiftedNumber = [];
	for (let [i, j] of number) {
		i += shiftBy;
		shiftedNumber = shiftedNumber.concat([[i, j]])
	}
	return shiftedNumber;
  }
}

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
  e.gamepad.index, e.gamepad.id,
  e.gamepad.buttons.length, e.gamepad.axes.length);
});

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      snakes[0].setNextMove('left');
      break;
    case 'ArrowRight':
      snakes[0].setNextMove('right');
      break;
    case 'ArrowUp':
      snakes[0].setNextMove('up');
      break;
    case 'ArrowDown':
      snakes[0].setNextMove('down');
      break;
    case 'a':
      snakes[1].setNextMove('left');
      break;
    case 'd':
      snakes[1].setNextMove('right');
      break;
    case 'w':
      snakes[1].setNextMove('up');
      break;
    case 's':
      snakes[1].setNextMove('down');
      break;
    case 'p':
      isPaused = !isPaused;
	  break;
  }
});

document.getElementById("btnHome").onclick = function() {toHome()};
document.getElementById("btnPaint").onclick = function() {toPaint()};

function toHome() {
	window.open("file:///C:/Users/brandon.dewitt/Downloads/tabLED-master/app/index.html","_self")
}

function toPaint() {
	window.open("file:///C:/Users/brandon.dewitt/Downloads/tabLED-master/app/paint.html","_self")
}

function changeAppleColor(colorIn) {
    appleColor = colorIn;
	// alert ("Color Change!");
}

// from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const init = () => {

  snakes = [];

  for (let i = 0; i < numPlayers; i++) {
    snakes.push(new Snake(
      INIT_TABLE[i].bodyColor,
      INIT_TABLE[i].scoreColor,
      INIT_TABLE[i].startCell,
      INIT_TABLE[i].direction,
      INIT_TABLE[i].player
    ));
  }

  apples = [];
};

const cellsEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};

const checkCollisions = () => {

  for (let snake of snakes) {
    const head = snake.getHead();
    const cells = snake.getCells();

	// check for collisions with wall
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

    // check for collisions with other players
    for (let other of snakes) {
      if (other !== snake) {

        const cells = other.getCells();

        for (let i = 1; i < cells.length; i++) {

          const cell = cells[i];
          if (cellsEqual(head, cell)) {
            return true;
          }
        }
      }
    }
  }
};

const checkEatApples = () => {
  for (let snake of snakes) {
    const head = snake.getHead();

    if (containsCell(apples, head)) {
      snake.grow();
      removeCell(apples, head);
      // table.draw(pixelBuffer);
    }
  }
};

const createRandomApple = () => {
  if (!isPaused) {
	  while (true) {

		const randX = randInRange(0, BOARD_WIDTH);
		const randY = randInRange(0, BOARD_HEIGHT);

		const cell = [randX, randY];

		let touchesNoSnakes = true;

		for (let snake of snakes) {

		  if (snake.coversCell(cell)) {
			touchesNoSnakes = false;
			break;
		  }
		}

		if (touchesNoSnakes && !containsCell(apples, cell)) {
		  apples.push(cell);
		  break;
		}
	  }
  }
};

const simulate = () => {

  for (let snake of snakes) {

    //snake.move(snake.direction);

	if (!isPaused) {
		snake.updatePosition();

		if (checkCollisions()) {
		  init();
		}
		checkEatApples();

		snake.convertScoreToCells(snake.player);
	}
  }

  render();
};

const render = () => {

  pixelBuffer.fill(BOARD_COLOR);

  for (let j = 0; j < BOARD_HEIGHT; j++) {
    for (let i = 0; i < BOARD_WIDTH; i++) {

      for (let snake of snakes) {
        if (containsCell(snake.scoreCells, [i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i]  = snake.scoreColor;
        }
        if (snake.coversCell([i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i]  = snake.bodyColor;
        }
        else if (containsCell(apples, [i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i]  = appleColor;
        }
      }
    }
  }

  browserDisplay.render(pixelBuffer);
  display.render(pixelBuffer);
};

init();
setInterval(simulate, SIMULATOR_DELAY_MILLISECONDS);
setInterval(createRandomApple, APPLE_DELAY_MILLISECONDS);

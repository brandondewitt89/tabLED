
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const APPLE_DELAY_MILLISECONDS = 3000;
const SIMULATOR_DELAY_MILLISECONDS = 100;
const GROW_LENGTH = 2;

const BOARD_COLOR = 0x3C2F2F;
const APPLE_COLOR = 0XC55452;
const SCORE_COLOR = 0x9B6862;

const NUM_ZERO = [ [1, 2], [1, 3], [1, 4], [2, 1], [2, 5], [3, 2], [3, 3], [3, 4] ];
const NUM_ONE = [ [1, 2], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 5] ];
const NUM_TWO = [ [1, 1], [1, 4], [1, 5], [2, 1], [2, 3], [2, 5], [3, 2], [3, 5] ];
const NUM_THREE = [ [1, 1], [1, 5], [2, 1], [2, 3], [2, 5], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5] ];
const NUM_FOUR = [ [1, 1], [1, 2], [1, 3], [2, 3], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5] ];
const NUM_FIVE = [ [1, 1], [1, 2], [1, 3], [1, 5], [2, 1], [2, 3], [2, 5], [3, 1], [3, 3], [3, 4] ];
const NUM_SIX = [ [1, 2], [1, 3], [1, 4], [1, 5], [2, 1], [2, 3], [2, 5], [3, 1], [3, 3], [3, 4], [3, 5] ];
const NUM_SEVEN = [ [1, 1], [1, 4], [1, 5], [2, 1], [2, 3], [3, 1], [3, 2] ];
const NUM_EIGHT = [ [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 1], [2, 3], [2, 5], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5] ];
const NUM_NINE = [ [1, 1], [1, 2], [1, 3], [1, 5], [2, 1], [2, 3], [2, 5], [3, 1], [3, 2], [3, 3], [3, 4] ];

const numPlayers = 1;
const INIT_TABLE = [
  {
    startCell: [0, 2],
    direction: 'down',
    bodyColor: 0xF0F0A0,
    scoreColor: 0x909060,
    player: 0
  },
  {
    startCell: [BOARD_WIDTH - 1, 2],
    direction: 'down',
    bodyColor: 0xA0F0F0,
    scoreColor: 0x609090,
    player:1
  },
];

const board = document.querySelector('#board');

const browserDisplay  = new BrowserDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

const display = new TableDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

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
          switch (scoreString[0]) {
			case '0':
              this.scoreCells = NUM_ZERO;
              break;
			  
            case '1':
              this.scoreCells = NUM_ONE;
              break;
			  
            case '2':
              this.scoreCells = NUM_TWO;
              break;
			  
            case '3':
              this.scoreCells = NUM_THREE;
              break;
			  
            case '4':
              this.scoreCells = NUM_FOUR;
              break;
			  
            case '5':
              this.scoreCells = NUM_FIVE;
              break;
			  
            case '6':
              this.scoreCells = NUM_SIX;
              break;
			  
            case '7':
              this.scoreCells = NUM_SEVEN;
              break;
			  
            case '8':
              this.scoreCells = NUM_EIGHT;
              break;
			  
            case '9':
              this.scoreCells = NUM_NINE;
          }
        }
        else if (i === 1) {
          switch (scoreString[1]) {
            case '0':
              this.scoreCells = this.scoreCells.concat([
                [5, 2], [5, 3], [5, 4], [6, 1], [6, 5], [7, 2], [7, 3], [7, 4]
              ])
              break;
            case '1':
			  this.scoreCells = this.scoreCells.concat(this.shiftScore(4, NUM_ONE))
            // this.scoreCells = this.scoreCells.concat([
                // [5, 2], [5, 5], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [7, 5]
              // ])
              break;
            case '2':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 4], [5, 5], [6, 1], [6, 3], [6, 5], [7, 2], [7, 5]
              ])
              break;
            case '3':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 5], [6, 1], [6, 3], [6, 5], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5]
              ])
              break;
            case '4':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 2], [5, 3], [6, 3], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5]
              ])
              break;
            case '5':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 2], [5, 3], [5, 5], [6, 1], [6, 3], [6, 5], [7, 1], [7, 3], [7, 4]
              ])
              break;

            case '6':
            this.scoreCells = this.scoreCells.concat([
                [5, 2], [5, 3], [5, 4], [5, 5], [6, 1], [6, 3], [6, 5], [7, 1], [7, 3], [7, 4], [7, 5]
              ])
              break;
            case '7':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 4], [5, 5], [6, 1], [6, 3], [7, 1], [7, 2]
              ])
              break;
            case '8':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [6, 1], [6, 3], [6, 5], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5]
              ])
              break;
            case '9':
            this.scoreCells = this.scoreCells.concat([
                [5, 1], [5, 2], [5, 3], [5, 5], [6, 1], [6, 3], [6, 5], [7, 1], [7, 2], [7, 3], [7, 4]
              ])
          }
        }
        else if (i === 2) {
          switch (scoreString[2]) {
            case '0':
              this.scoreCells = this.scoreCells.concat([
                [9, 2], [9, 3], [9, 4], [10, 1], [10, 5], [11, 2], [11, 3], [11, 4]
              ])
              break;
            case '1':
            this.scoreCells = this.scoreCells.concat([
                [9, 2], [9, 5], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [11, 5]
              ])
              break;
            case '2':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 4], [9, 5], [10, 1], [10, 3], [10, 5], [11, 2], [11, 5]
              ])
              break;
            case '3':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 5], [10, 1], [10, 3], [10, 5], [11, 1], [11, 2], [11, 3], [11, 4], [11, 5]
              ])
              break;
            case '4':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 2], [9, 3], [10, 3], [11, 1], [11, 2], [11, 3], [11, 4], [11, 5]
              ])
              break;
            case '5':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 2], [9, 3], [9, 5], [10, 1], [10, 3], [10, 5], [11, 1], [11, 3], [11, 4]
              ])
              break;

            case '6':
            this.scoreCells = this.scoreCells.concat([
                [9, 2], [9, 3], [9, 4], [9, 5], [10, 1], [10, 3], [10, 5], [11, 1], [11, 3], [11, 4], [11, 5]
              ])
              break;
            case '7':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 4], [9, 5], [10, 1], [10, 3], [11, 1], [11, 2]
              ])
              break;
            case '8':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [10, 1], [10, 3], [10, 5], [11, 1], [11, 2], [11, 3], [11, 4], [11, 5]
              ])
              break;
            case '9':
            this.scoreCells = this.scoreCells.concat([
                [9, 1], [9, 2], [9, 3], [9, 5], [10, 1], [10, 3], [10, 5], [11, 1], [11, 2], [11, 3], [11, 4]
              ])
          }
        }
      }
    }
    else if (player === 1) {
      for (let i = 0; i < scoreString.length; i++) {
        if (i === 0) {
          switch (scoreString[0]) {
            case '0':
              this.scoreCells = [
                [20, 2], [20, 3], [20, 4], [21, 1], [21, 5], [22, 2], [22, 3], [22, 4]
              ]
              break;
            case '1':
              this.scoreCells = [
                [20, 2], [20, 5], [21, 1], [21, 2], [21, 3], [21, 4], [21, 5], [22, 5]
              ]
              break;
            case '2':
              this.scoreCells = [
                [20, 1], [20, 4], [20, 5], [21, 1], [21, 3], [21, 5], [22, 2], [22, 5]
              ]
              break;
            case '3':
              this.scoreCells = [
                [20, 1], [20, 5], [21, 1], [21, 3], [21, 5], [22, 1], [22, 2], [22, 3], [22, 4], [22, 5]
              ]
              break;
            case '4':
              this.scoreCells = [
                [20, 1], [20, 2], [20, 3], [21, 3], [22, 1], [22, 2], [22, 3], [22, 4], [22, 5]
              ]
              break;
            case '5':
              this.scoreCells = [
                [20, 1], [20, 2], [20, 3], [20, 5], [21, 1], [21, 3], [21, 5], [22, 1], [22, 3], [22, 4]
              ]
              break;

            case '6':
              this.scoreCells = [
                [20, 2], [20, 3], [20, 4], [20, 5], [2, 1], [2, 3], [2, 5], [3, 1], [3, 3], [3, 4], [3, 5]
              ]
              break;
            case '7':
              this.scoreCells = [
                [20, 1], [20, 4], [20, 5], [21, 1], [21, 3], [22, 1], [22, 2]
              ]
              break;
            case '8':
              this.scoreCells = [
                [20, 1], [20, 2], [20, 3], [20, 4], [20, 5], [21, 1], [21, 3], [21, 5], [22, 1], [22, 2], [22, 3], [22, 4], [22, 5]
              ]
              break;
            case '9':
              this.scoreCells = [
                [20, 1], [20, 2], [20, 3], [20, 5], [21, 1], [21, 3], [21, 5], [22, 1], [22, 2], [22, 3], [22, 4]
              ]
          }
        }
        else if (i === 1) {
          switch (scoreString[1]) {
            case '0':
              this.scoreCells = this.scoreCells.concat([
                [24, 2], [24, 3], [24, 4], [25, 1], [25, 5], [26, 2], [26, 3], [26, 4]
              ])
              break;
            case '1':
            this.scoreCells = this.scoreCells.concat([
                [24, 2], [24, 5], [25, 1], [25, 2], [25, 3], [25, 4], [25, 5], [26, 5]
              ])
              break;
            case '2':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 4], [24, 5], [25, 1], [25, 3], [25, 5], [26, 2], [26, 5]
              ])
              break;
            case '3':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 5], [25, 1], [25, 3], [25, 5], [26, 1], [26, 2], [26, 3], [26, 4], [26, 5]
              ])
              break;
            case '4':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 2], [24, 3], [25, 3], [26, 1], [26, 2], [26, 3], [26, 4], [26, 5]
              ])
              break;
            case '5':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 2], [24, 3], [24, 5], [25, 1], [25, 3], [25, 5], [26, 1], [26, 3], [26, 4]
              ])
              break;

            case '6':
            this.scoreCells = this.scoreCells.concat([
                [24, 2], [24, 3], [24, 4], [24, 5], [25, 1], [25, 3], [25, 5], [26, 1], [26, 3], [26, 4], [26, 5]
              ])
              break;
            case '7':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 4], [24, 5], [25, 1], [25, 3], [26, 1], [26, 2]
              ])
              break;
            case '8':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 2], [24, 3], [24, 4], [24, 5], [25, 1], [25, 3], [25, 5], [26, 1], [26, 2], [26, 3], [26, 4], [26, 5]
              ])
              break;
            case '9':
            this.scoreCells = this.scoreCells.concat([
                [24, 1], [24, 2], [24, 3], [24, 5], [25, 1], [25, 3], [25, 5], [26, 1], [26, 2], [26, 3], [26, 4]
              ])
          }
        }
        else if (i === 2) {
          switch (scoreString[2]) {
            case '0':
              this.scoreCells = this.scoreCells.concat([
                [28, 2], [28, 3], [28, 4], [29, 1], [29, 5], [30, 2], [30, 3], [30, 4]
              ])
              break;
            case '1':
            this.scoreCells = this.scoreCells.concat([
                [28, 2], [28, 5], [29, 1], [29, 2], [29, 3], [29, 4], [29, 5], [30, 5]
              ])
              break;
            case '2':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 4], [28, 5], [29, 1], [29, 3], [29, 5], [30, 2], [30, 5]
              ])
              break;
            case '3':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 5], [29, 1], [29, 3], [29, 5], [30, 1], [30, 2], [30, 3], [30, 4], [30, 5]
              ])
              break;
            case '4':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 2], [28, 3], [29, 3], [30, 1], [30, 2], [30, 3], [30, 4], [30, 5]
              ])
              break;
            case '5':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 2], [28, 3], [28, 5], [29, 1], [29, 3], [29, 5], [30, 1], [30, 3], [30, 4]
              ])
              break;

            case '6':
            this.scoreCells = this.scoreCells.concat([
                [28, 2], [28, 3], [28, 4], [28, 5], [29, 1], [29, 3], [29, 5], [30, 1], [30, 3], [30, 4], [30, 5]
              ])
              break;
            case '7':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 4], [28, 5], [29, 1], [29, 3], [30, 1], [30, 2]
              ])
              break;
            case '8':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 2], [28, 3], [28, 4], [28, 5], [29, 1], [29, 3], [29, 5], [30, 1], [30, 2], [30, 3], [30, 4], [30, 5]
              ])
              break;
            case '9':
            this.scoreCells = this.scoreCells.concat([
                [28, 1], [28, 2], [28, 3], [28, 5], [29, 1], [29, 3], [29, 5], [30, 1], [30, 2], [30, 3], [30, 4]
              ])
          }
        }
      }
    }
  };
  
  shiftScore(shiftBy, number) {
	let shiftedNumber = [];
	for (let [i, j] of number) {
		i += shiftBy;
		shiftedNumber = shiftedNumber.concat([i, j])
	}
	return shiftedNumber;
  }
  // shiftScore(player, digit, number) {
	  // switch (player) {
		// case 0:
		  // switch (digit) {
			// case 0:
			  // return number;
			  // break;
			
			// case 1:
			  // for (let [i, j] of number) {
				  // i += 4;
			  // }
			  // return number;
			  // break;
			
			// case 2:
			  // for (let [i, j] of number) {
				  // i += 8;
			  // }
			  // return number;
			  // break;
		  // }
		  // break;
		
		// case 1:
		  // switch (digit) {
			// case 0:
			  // for (let [i, j] of number) {
				  // i += 19;
			  // }
			  // return number;
			  // break;
			
			// case 1:
			  // for (let [i, j] of number) {
				  // i += 23;
			  // }
			  // return number;
			  // break;
			
			// case 2:
			  // for (let [i, j] of number) {
				  // i += 27;
			  // }
			  // return number;
			  // break;
		  // }
		  // break;
	  // }
  // }
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
  }
});

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

    // check collisions with other players
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
};

const simulate = () => {

  for (let snake of snakes) {

    //snake.move(snake.direction);

    snake.updatePosition();

    if (checkCollisions()) {
      init();
    }
    checkEatApples();

    snake.convertScoreToCells(snake.player);
  }

  // for (let score of scores) {
  //   score.convertScoreToCells(snakeLength[score.player], score.player);
  // }

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
          pixelBuffer[j*BOARD_WIDTH + i]  = APPLE_COLOR;
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

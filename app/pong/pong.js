
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const PADDLE_HEIGHT = 3; // pixels
const MOVE_BALL_MILLISECONDS = 250;
const MOVE_PADDLE_MILLISECONDS = 250;
const SIMULATOR_DELAY_MILLISECONDS = 125;

const board = document.querySelector('#board');

let pong;
let paused = false;

const host = '192.168.0.24';
const port = '81';
const table = new tabLED(host, port);

const pixelBuffer = new Uint32Array(BOARD_WIDTH * BOARD_HEIGHT);


class Pong {

  constructor() {
    this._paddleLeft = {
      x: 0,
      y: 0,
      direction: 0,
      canMove: true
    };
    this._paddleRight = {
      x: BOARD_WIDTH - 1,
      y: BOARD_HEIGHT - PADDLE_HEIGHT,
      direction: 0,
      canMove: true
    };
    this._ball = {
      x: BOARD_WIDTH - 2,
      y: BOARD_HEIGHT - 7,
      direction: [-1, -1]
    }
  }

  setPaddleDirection(side, dirVal) {
    let paddle;
    if (side === "left") {
      paddle = this._paddleLeft;
    } else if (side === "right") {
      paddle = this._paddleRight;
    } else {
      throw "INVALID SIDE NAME " + side;
    }

    paddle.direction = dirVal;
    this.checkPaddleMove(paddle);
  }

  checkPaddleMove(paddle) {
    if (!paddle.canMove) {
      return;
    }

    paddle.y = Math.max(0, Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, paddle.y + paddle.direction));
    paddle.canMove = false;
    setTimeout(() => {
      if (paused) {
        return;
      }

      paddle.canMove = true;
      this.checkPaddleMove(paddle);
    }, MOVE_PADDLE_MILLISECONDS);
  }

  moveBall() {
    // Check for paddle bounce
    if (this.isPaddleCell([this._ball.x + this._ball.direction[0], this._ball.y + this._ball.direction[1]])) {
      this._ball.direction[0] *= -1;
    }

    // Actual move
    this._ball.x += this._ball.direction[0];
    this._ball.y += this._ball.direction[1];

    // Check for floor/ceiling bounce
    if (this._ball.y <= 0) {
      this._ball.direction[1] = 1;
    } else if (this._ball.y >= (BOARD_HEIGHT - 1)) {
      this._ball.direction[1] = -1;
    }

    // Check for score
    if (this._ball.x < 1 || this._ball.x >= (BOARD_WIDTH - 1)) {
      paused = true;
      setTimeout(() => {
        init();
        paused = false;
      }, 5000);
    }
  }

  isPaddleCell(coord) {
    for (let paddle of [this._paddleLeft, this._paddleRight]) {
      if (coord[0] === paddle.x && coord[1] >= paddle.y && coord[1] < (paddle.y + PADDLE_HEIGHT)) {
        return true;
      }
    }
    return false;
  }

  isBallCell(coord) {
    return coord[0] === this._ball.x && coord[1] === this._ball.y;
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'q':
      pong.setPaddleDirection("left", -1);
      break;
    case 'z':
      pong.setPaddleDirection("left", 1);
      break;
    case 'o':
      pong.setPaddleDirection("right", -1);
      break;
    case 'm':
      pong.setPaddleDirection("right", 1);
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'q':
      pong.setPaddleDirection("left", 0);
      break;
    case 'z':
      pong.setPaddleDirection("left", 0);
      break;
    case 'o':
      pong.setPaddleDirection("right", 0);
      break;
    case 'm':
      pong.setPaddleDirection("right", 0);
      break;
    }
});

const init = () => {
  pong = new Pong();
};

const simulate = () => {
  renderHtml();
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

      if (pong.isPaddleCell([i, j])) {
        cell.style.backgroundColor = 'SteelBlue';
      }
      else if (pong.isBallCell([i, j])) {
        cell.style.backgroundColor = 'Tomato';
      }
      else {
        cell.style.backgroundColor = 'LightGray';
      }

      row.appendChild(cell);
    }
  }
};

init();
setInterval(simulate, SIMULATOR_DELAY_MILLISECONDS);
setInterval(()=>{ if (!paused) {pong.moveBall();} }, MOVE_BALL_MILLISECONDS);

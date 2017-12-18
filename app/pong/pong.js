
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const PADDLE_HEIGHT = 3; // pixels
const MOVE_BALL_MILLISECONDS = 250;
const MOVE_PADDLE_MILLISECONDS = 250;
const SIMULATOR_DELAY_MILLISECONDS = 125;

const board = document.querySelector('#board');

const DIGIT_WIDTH = 5;
const DIGIT_HEIGHT = 8;
const digits = {
  '0': [
    [' ', 'x', 'x', 'x', ' '],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
  ],
  '1': [
    [' ', ' ', 'x', ' ', ' '],
    [' ', 'x', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    ['x', 'x', 'x', 'x', 'x'],
  ],
  '2': [
    [' ', 'X', 'x', 'x', ' '],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', ' ', ' ', ' ', 'x'],
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', 'x', ' ', ' ', ' '],
    ['x', ' ', ' ', ' ', ' '],
    ['x', 'x', 'x', 'x', 'x'],
  ],
  '3': [
    ['x', 'x', 'x', 'x', 'x'],
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', 'x'],
    [' ', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
  ],
  '4': [
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', 'x', 'x', ' '],
    [' ', 'x', ' ', 'x', ' '],
    ['x', ' ', ' ', 'x', ' '],
    ['x', 'x', 'x', 'x', 'x'],
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', 'x', ' '],
  ],
  '5': [
    ['x', 'x', 'x', 'x', 'x'],
    ['x', ' ', ' ', ' ', ' '],
    ['x', 'x', 'x', 'x', ' '],
    [' ', ' ', ' ', ' ', 'x'],
    [' ', ' ', ' ', ' ', 'x'],
    [' ', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
  ],
  '6': [
    [' ', 'x', 'x', 'x', ' '],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', ' '],
    ['x', ' ', 'x', 'x', ' '],
    ['x', 'x', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
  ],
  '7': [
    ['x', 'x', 'x', 'x', 'x'],
    [' ', ' ', ' ', ' ', 'x'],
    [' ', ' ', ' ', 'x', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
    [' ', ' ', 'x', ' ', ' '],
  ],
  '8': [
    [' ', 'x', 'x', 'x', ' '],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
  ],
  '9': [
    [' ', 'x', 'x', 'x', ' '],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', 'x', 'x'],
    [' ', 'x', 'x', ' ', 'x'],
    [' ', ' ', ' ', ' ', 'x'],
    ['x', ' ', ' ', ' ', 'x'],
    [' ', 'x', 'x', 'x', ' '],
  ]
}

let pong;
let paused = false;

const host = '192.168.0.24';
const port = '81';
const table = new tabLED(host, port);

const pixelBuffer = new Uint32Array(BOARD_WIDTH * BOARD_HEIGHT);

const display = new BrowserDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

class Pong {

  constructor(leftScore, rightScore) {
    this._paddleLeft = {
      x: 0,
      y: 0,
      direction: 0,
      canMove: true,
      score: leftScore
    };
    this._paddleRight = {
      x: BOARD_WIDTH - 1,
      y: BOARD_HEIGHT - PADDLE_HEIGHT,
      direction: 0,
      canMove: true,
      score: rightScore
    };
    this._ball = {
      x: BOARD_WIDTH - 2,
      y: BOARD_HEIGHT - 7,
      direction: [-1, -1]
    }
  }

  getScores() {
    return [this._paddleLeft.score, this._paddleRight.score];
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

      if (this._ball.x < 1) {
        this._paddleRight.score += 1;
      } else {
        this._paddleLeft.score += 1;
      }


      setTimeout(() => {
        if (this._paddleLeft.score >= 9 || this._paddleRight.score >= 9) {
          this._paddleLeft.score = 0;
          this._paddleRight.score = 0;
          setTimeout(() => {
            init(0, 0);
            paused = false;
          }, 3000);
        } else {

          init(this._paddleLeft.score, this._paddleRight.score);
          paused = false;
        }
      }, 3000);
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

const init = (leftScore, rightScore) => {
  pong = new Pong(leftScore, rightScore);
};

const simulate = () => {
  render();
};

const render= () => {

  if (!paused) {
    pixelBuffer.fill(0xCFCFCF);

    for (let j = 0; j < BOARD_HEIGHT; j++) {
      for (let i = 0; i < BOARD_WIDTH; i++) {

        if (pong.isPaddleCell([i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i]  = 0x0000FF;
        }
        else if (pong.isBallCell([i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i]  = 0xFF0000;
        }
      }
    }
  } else {
    pixelBuffer.fill(0xCFCFCF);
    let scores = pong.getScores();

    let entries = [
      {
        x0: Math.floor(BOARD_WIDTH / 4) - Math.floor(DIGIT_WIDTH / 2),
        y0: Math.floor(BOARD_HEIGHT / 2) - Math.floor(DIGIT_HEIGHT / 2),
        score: scores[0]
      },
      {
        x0: Math.floor(BOARD_WIDTH / 4) * 3 - Math.floor(DIGIT_WIDTH / 2),
        y0: Math.floor(BOARD_HEIGHT / 2) - Math.floor(DIGIT_HEIGHT / 2),
        score: scores[1]
      }
    ];

    for (let entry of entries) {
      let digit = digits[entry.score.toString()[0]];

      for (let x = 0; x < DIGIT_WIDTH; ++x) {
        for (let y = 0; y < DIGIT_HEIGHT; ++y) {
          if (digit[y][x] !== ' ') {
            let ind = (entry.y0 + y)*BOARD_WIDTH + (entry.x0 + x);
            pixelBuffer[ind] = 0xFF0000;
          }
        }
      }
    }
  }

  display.render(pixelBuffer);
};

init(0, 0);
setInterval(simulate, SIMULATOR_DELAY_MILLISECONDS);
setInterval(()=>{ if (!paused) {pong.moveBall();} }, MOVE_BALL_MILLISECONDS);

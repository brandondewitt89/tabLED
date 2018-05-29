
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const RENDER_DELAY_MILLISECONDS = 100;

const COLOR_BLACK = 0X000000;
const COLOR_WHITE = 0XFFFFFF;
const COLOR_RED   = 0XFF0000;
const COLOR_GREEN = 0X00FF00;
const COLOR_BLUE  = 0X0000FF;

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

// initial conditions
let fillColor = 0X846F32;
let paintColor = 0X846F32;

let scrollX = 2;
let paintCells = [];
let messageString = "1234";
let messageCharArray = [];

messageCharArray = messageString.split();

console.log("messageString: " + messageString);
console.log("messageCharArray: " + messageCharArray[1]);

var scrollText = new Array(message.length);
for (var i = 0; i < scrollText.length; i++) {
  scrollText[i] = new Character();
}
// scrollText[0] = new Character(COLOR_GREEN, "2");

var pixels = new Array(BOARD_WIDTH);
for (var i = 0; i < pixels.length; i++) {
  pixels[i] = new Array(BOARD_HEIGHT);
}


for (var j = 0; j < BOARD_HEIGHT; j++) {
  for (var i = 0; i < BOARD_WIDTH; i++) {
    pixels[i][j] = new Pixel(COLOR_BLACK);
  }
}

const board = document.querySelector('#board');

const browserDisplay  = new BrowserDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

const display = new TableDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

// initialize board pixels
const pixelBuffer = new Uint32Array(BOARD_WIDTH * BOARD_HEIGHT);
pixelBuffer.fill(COLOR_BLACK);

const containsCell = (list, cellToCheck) => {
  for (let cell of list) {
    if (cellsEqual(cell, cellToCheck)) {
      return true;
    }
  }
  return false;
};

const cellsEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};

// document.getElementById("btnSaveImage").onclick = function() {saveImage(pixels)};
// document.getElementById("btnLoadImage").onclick = function() {loadImage()};
// document.getElementById("btnFillPicker").onclick = function() {changeFillColor(color)};
// document.getElementById("btnClear").onclick = function() {changeFillColor(COLOR_BLACK)};


for (var j = 0; j < BOARD_HEIGHT; j++) {
  for (var i = 0; i < BOARD_WIDTH; i++) {
    pixelBuffer[j * BOARD_WIDTH + i] = pixels[i][j].getColor();
  }
}

function shiftScore(shiftByX, shiftByY, number) {
	let shiftedNumber = [];
	for (let [i, j] of number) {
		i += shiftByX;
		j += shiftByY;
		shiftedNumber = shiftedNumber.concat([[i, j]])
	}
	return shiftedNumber;
}

const simulate = () => {
  if (scrollX >= 31) {
	  scrollX = 0;
  }
  else {
	  scrollX++;
  }
  // paintCells = shiftScore(scrollX, 4, NUM_ZERO);
  paintCells = scrollText[1].convertCharToMatrix("1");
  render();
};

const render = () => {
  for (var j = 0; j < BOARD_HEIGHT; j++) {
    for (var i = 0; i < BOARD_WIDTH; i++) {
      // pixelBuffer[j * BOARD_WIDTH + i] = pixels[i][j].getColor();
	  pixelBuffer[j*BOARD_WIDTH + i] = COLOR_BLACK;
	  if (containsCell(paintCells, [i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i]  = paintColor;
      }
    }
  }

  browserDisplay.render(pixelBuffer);
  display.render(pixelBuffer);
};

// function printMousePos(event) {
	// var relX = event.offsetX;
	// var relY = event.offsetY;
	// var PixelX = Math.trunc(relX / 20);
	// var PixelY = Math.trunc(relY / 20);

  // pixels[PixelX][PixelY].setColor(paintColor);
	// }

// browserDisplay._canvas.addEventListener("click", printMousePos);

// $(document).ready(function () {
  // $(".pick-a-color").pickAColor({
    // showSpectrum            : true,
    // showSavedColors         : true,
    // saveColorsPerElement    : true,
    // fadeMenuToggle          : true,
    // showAdvanced						: true,
    // showBasicColors         : true,
    // showHexInput            : true,
    // allowBlank							: true,
    // inlineDropdown					: true
  // });

  // $(".pick-a-color").on("change", function () {
    // console.log($(this).val());
    // color = parseInt("0X" + ($(this).val()));
    // changePaintColor(color);
  // });
// });

// init();

setInterval(simulate, RENDER_DELAY_MILLISECONDS);

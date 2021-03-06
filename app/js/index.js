
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

// initial conditions
let fillColor = 0X846F32;
let paintColor = 0X846F32;

let scrollX = -1;
let frameCount = 0;
let paintCells = [];
let messageString = "HELLO COFFEE TABLE!!!";
let messageCharArray = [];

messageCharArray = messageString.split("");
let scrollText = new Array(messageCharArray.length);
for (var i = 0; i < scrollText.length; i++) {
  scrollText[i] = new Character();
  scrollText[i].convertCharToMatrix(messageCharArray[i]);
  paintCells = paintCells.concat(scrollText[i].shiftChar(4*i + BOARD_WIDTH, 5));
}

// console.log("messageString: " + messageString);
// console.log("messageCharArray: " + messageCharArray[1]);
// console.log("messageCharArray.length: " + messageCharArray.length);

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

document.getElementById("btnScrollText").onclick = function() {displayText()};

function displayText() {
	messageString = document.getElementById("textInput").value;
	messageCharArray = messageString.split("");
	scrollText = scrollText.splice();
	scrollText = new Array(messageCharArray.length);
	paintCells = paintCells.splice();
	frameCount = 0;
	for (var i = 0; i < scrollText.length; i++) {
	  scrollText[i] = new Character();
	  scrollText[i].convertCharToMatrix(messageCharArray[i]);
	  paintCells = paintCells.concat(scrollText[i].shiftChar(4*i + BOARD_WIDTH, 5));
	}
}

function changePaintColor(color) {
    paintColor = color;
    // return fillColor;
	// alert ("Color Change!");
}

for (var j = 0; j < BOARD_HEIGHT; j++) {
  for (var i = 0; i < BOARD_WIDTH; i++) {
    pixelBuffer[j * BOARD_WIDTH + i] = pixels[i][j].getColor();
  }
}

const simulate = () => {
  if (frameCount >= 4*scrollText.length + BOARD_WIDTH) {
	  scrollX = 4*scrollText.length + BOARD_WIDTH;
	  frameCount = 0;
  }
  else {
	  scrollX = -1;
	  frameCount++;
  }
  paintCells = paintCells.splice();
  for (var i = 0; i < scrollText.length; i++) {
	  paintCells = paintCells.concat(scrollText[i].shiftChar(scrollX, 0));
  }
  // paintCells = scrollText[1].convertCharToMatrix("1");
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
// 	var relX = event.offsetX;
// 	var relY = event.offsetY;
// 	var PixelX = Math.trunc(relX / 20);
// 	var PixelY = Math.trunc(relY / 20);
//
//   pixels[PixelX][PixelY].setColor(paintColor);
// 	}
//
// browserDisplay._canvas.addEventListener("click", printMousePos);

$(document).ready(function () {
  $(".pick-a-color").pickAColor({
    showSpectrum            : true,
    showSavedColors         : true,
    saveColorsPerElement    : true,
    fadeMenuToggle          : true,
    showAdvanced						: true,
    showBasicColors         : true,
    showHexInput            : true,
    allowBlank							: true,
    inlineDropdown					: true
  });

  $(".pick-a-color").on("change", function () {
    console.log($(this).val());
    color = parseInt("0X" + ($(this).val()));
    changePaintColor(color);
  });
});

// init();

setInterval(simulate, RENDER_DELAY_MILLISECONDS);

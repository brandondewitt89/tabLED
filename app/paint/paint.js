
const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const RENDER_DELAY_MILLISECONDS = 100;


const COLOR_RED   = 0XFF0000;
const COLOR_GREEN = 0X00FF00;
const COLOR_BLUE  = 0X0000FF;
const COLOR_BLACK = 0X000000;

// initial conditions
let fillColor = 0X3C2F2F;
let paintColor = 0X3C2F2F;
let testColor = 0X0000FF;

let paintCells = [0, 0];


const board = document.querySelector('#board');

const browserDisplay  = new BrowserDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

const display = new TableDisplay(
  BOARD_WIDTH, BOARD_HEIGHT);

// initialize board pixels
const pixelBuffer = new Uint32Array(BOARD_WIDTH * BOARD_HEIGHT);
pixelBuffer.fill(0x00FFFF);


document.getElementById("btnFillRed").onclick = function() {changeFillColor(COLOR_RED)};
document.getElementById("btnFillGreen").onclick = function() {changeFillColor(COLOR_GREEN)};
document.getElementById("btnFillBlue").onclick = function() {changeFillColor(COLOR_BLUE)};
document.getElementById("btnFillPicker").onclick = function() {changeFillColor(paintColor)};
document.getElementById("btnClear").onclick = function() {clearPaintCells(paintCells)};

function changeFillColor(colorIn) {
    fillColor = colorIn;
	// alert ("Color Change!");
}

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

function clearPaintCells(list) {
  list.splice(0);
}

const render = () => {

  pixelBuffer.fill(COLOR_BLACK);

  for (let j = 0; j < BOARD_HEIGHT; j++) {
    for (let i = 0; i < BOARD_WIDTH; i++) {
		if (containsCell(paintCells, [i, j])) {
          pixelBuffer[j*BOARD_WIDTH + i] = fillColor;
        }
    }
  }

  browserDisplay.render(pixelBuffer);
  display.render(pixelBuffer);
};

function printMousePos(event) {
	let relX = event.offsetX;
	let relY = event.offsetY;
	let PixelX = Math.trunc(relX / 20);
	let PixelY = Math.trunc(relY / 20);
	
	const paintCell = [PixelX, PixelY]
	paintCells.push(paintCell);


	// console.log("offsetX: " + relX + " - offsetY: " + relY);
	// console.log("PixelX: " + PixelX + " - PixelY: " + PixelY);
	}

browserDisplay._canvas.addEventListener("click", printMousePos);

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
    paintColor = parseInt("0X" + ($(this).val()));
  });
});

// init();
setInterval(render, RENDER_DELAY_MILLISECONDS);


const BOARD_WIDTH = 32;
const BOARD_HEIGHT = 16;
const CELL_WIDTH = '20px';
const CELL_HEIGHT = CELL_WIDTH;
const RENDER_DELAY_MILLISECONDS = 100;


const COLOR_RED   = 0XFF0000;
const COLOR_GREEN = 0X00FF00;
const COLOR_BLUE  = 0X0000FF;

// initial conditions
let fillColor = 0X3C2F2F;
let paintColor = 0X3C2F2F;


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

function changeFillColor(colorIn) {
    fillColor = colorIn;
	// alert ("Color Change!");
}


const render = () => {

  pixelBuffer.fill(fillColor);

  // for (let j = 0; j < BOARD_HEIGHT; j++) {
  //   for (let i = 0; i < BOARD_WIDTH; i++) {
  //
  //     for (let snake of snakes) {
  //       if (containsCell(snake.scoreCells, [i, j])) {
  //         pixelBuffer[j*BOARD_WIDTH + i]  = snake.scoreColor;
  //       }
  //       if (snake.coversCell([i, j])) {
  //         pixelBuffer[j*BOARD_WIDTH + i]  = snake.bodyColor;
  //       }
  //       else if (containsCell(apples, [i, j])) {
  //         pixelBuffer[j*BOARD_WIDTH + i]  = appleColor;
  //       }
  //     }
  //   }
  // }

  browserDisplay.render(pixelBuffer);
  display.render(pixelBuffer);
};

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

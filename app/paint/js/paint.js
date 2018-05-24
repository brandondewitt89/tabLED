
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
let fillColor = 0X3C2F2F;
let paintColor = 0X3C2F2F;

// let paintCells = [];

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

// playing with local storage
// var names = [];
// names[0] = prompt("New member name?");
// localStorage.setItem("names", JSON.stringify(names));
//
// var storedNames = JSON.parse(localStorage.getItem("names"));

document.getElementById("btnSaveImage").onclick = function() {saveImage(pixels)};
document.getElementById("btnLoadImage").onclick = function() {loadImage()};
document.getElementById("btnFillPicker").onclick = function() {changeFillColor(color)};
document.getElementById("btnClear").onclick = function() {changeFillColor(COLOR_BLACK)};
document.getElementById("btnHome").onclick = function() {toHome()};
document.getElementById("btnSnake").onclick = function() {toSnake()};

function toHome() {
	window.open("file:///C:/Users/brandon.dewitt/Downloads/tabLED-master/app/index.html","_self")
}

function toSnake() {
	window.open("file:///C:/Users/brandon.dewitt/Downloads/tabLED-master/app/snake.html","_self")
}

function saveImage(temp) {
  var image = new Array(BOARD_WIDTH);
  for (var i = 0; i < image.length; i++) {
    image[i] = new Array(BOARD_HEIGHT);
  }
  for (var j = 0; j < BOARD_HEIGHT; j++) {
    for (var i = 0; i < BOARD_WIDTH; i++) {
      image[i][j] = temp[i][j].getColor();
    }
  }
  var imageName = prompt("Please enter the image name", "Temp");
    if (imageName != null) {
		localStorage.setItem(imageName, JSON.stringify(image));
    }
  
  // console.log('pixels: ' + pixels);
  // console.log('image: ' + image);
  // for (var j = 0; j < BOARD_HEIGHT; j++) {
    // for (var i = 0; i < BOARD_WIDTH; i++) {
      // console.log('pixels' + '[' + i + ']' + '[' + j + ']: ' + pixels[i][j].getColor());
      // console.log('temp' + '[' + i + ']' + '[' + j + ']: ' + temp[i][j].getColor());
      // console.log('image' + '[' + i + ']' + '[' + j + ']: ' + image[i][j]);
    // }
  // }
}

function loadImage() {
  var imageName = prompt("Please enter the image name", "Temp");
  var loadedImage = JSON.parse(localStorage.getItem(imageName));
  // pixels = loadedImage;
  // console.log('loaded image: ' + loadedImage);
  // console.log('pixels: ' + pixels);
  for (var j = 0; j < BOARD_HEIGHT; j++) {
    for (var i = 0; i < BOARD_WIDTH; i++) {
      pixels[i][j] = new Pixel(loadedImage[i][j]);
      // console.log('pixels' + '[' + i + ']' + '[' + j + ']: ' + pixels[i][j]);
      // console.log('loadedImage' + '[' + i + ']' + '[' + j + ']: ' + loadedImage[i][j]);
    }
  }
}

function changePaintColor(color) {
    paintColor = color;
    // return fillColor;
	// alert ("Color Change!");
}

function changeFillColor(color) {
    fillColor = color;
    for (var j = 0; j < BOARD_HEIGHT; j++) {
      for (var i = 0; i < BOARD_WIDTH; i++) {
        pixels[i][j].setColor(fillColor);
      }
    }
}

for (var j = 0; j < BOARD_HEIGHT; j++) {
  for (var i = 0; i < BOARD_WIDTH; i++) {
    pixelBuffer[j * BOARD_WIDTH + i] = pixels[i][j].getColor();
  }
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

// function clearPaintCells(list) {
//   list.splice(0);
// }

const render = () => {
  for (var j = 0; j < BOARD_HEIGHT; j++) {
    for (var i = 0; i < BOARD_WIDTH; i++) {
      pixelBuffer[j * BOARD_WIDTH + i] = pixels[i][j].getColor();
    }
  }

  browserDisplay.render(pixelBuffer);
  display.render(pixelBuffer);
};

function printMousePos(event) {
	var relX = event.offsetX;
	var relY = event.offsetY;
	var PixelX = Math.trunc(relX / 20);
	var PixelY = Math.trunc(relY / 20);

  pixels[PixelX][PixelY].setColor(paintColor);
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
    // console.log($(this).val());
    color = parseInt("0X" + ($(this).val()));
    changePaintColor(color);
  });
});

// init();
setInterval(render, RENDER_DELAY_MILLISECONDS);

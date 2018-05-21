function Pixel(color) {
  this.color            = color;

  this.previousColor    = null;
}

Pixel.prototype.setColor = function (color) {
  this.color = color;
};

Pixel.prototype.getColor = function () {
  return this.color;
};

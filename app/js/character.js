function Character(color, charString) {
  this.color            = color;
  this.charString       = charString;

  this.previousColor    = null;
  this.charMatrix       = [];
}

Character.prototype.setColor = function (color) {
  this.color = color;
};

Character.prototype.getColor = function () {
  return this.color;
};

Character.prototype.convertCharToMatrix = function (charString) {
  switch (charString) {
    case 'A':
      this.charMatrix = CHAR_A;
      break;
  }
  return this.charMatrix;
};

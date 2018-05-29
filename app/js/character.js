function Character(color, charString) {
  this.color            = color;
  this.charString       = charString;

  this.previousColor    = null;
  this.charMatrix       = [];
  
	this.NUM_ZERO =  [ [0, 2], [0, 3], [0, 4], [1, 1], [1, 5], [2, 2], [2, 3], [2, 4] ];
	this.NUM_ONE =   [ [0, 2], [0, 5], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5] ];
	this.NUM_TWO =   [ [0, 1], [0, 4], [0, 5], [1, 1], [1, 3], [1, 5], [2, 2], [2, 5] ];
	this.NUM_THREE = [ [0, 1], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ];
	this.NUM_FOUR =  [ [0, 1], [0, 2], [0, 3], [1, 3], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ];
	this.NUM_FIVE =  [ [0, 1], [0, 2], [0, 3], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 3], [2, 4] ];
	this.NUM_SIX =   [ [0, 2], [0, 3], [0, 4], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 3], [2, 4], [2, 5] ];
	this.NUM_SEVEN = [ [0, 1], [0, 4], [0, 5], [1, 1], [1, 3], [2, 1], [2, 2] ];
	this.NUM_EIGHT = [ [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5] ];
	this.NUM_NINE =  [ [0, 1], [0, 2], [0, 3], [0, 5], [1, 1], [1, 3], [1, 5], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_A    = [ [0, 2], [0, 3], [0, 4], [1, 1], [1, 5], [2, 2], [2, 3], [2, 4] ];
}


Character.prototype.setColor = function (color) {
  this.color = color;
};

Character.prototype.getColor = function () {
  return this.color;
};

Character.prototype.convertCharToMatrix = function (charString) {
  switch (charString) {
    case '0':
      this.charMatrix = this.NUM_ZERO;
      break;
	case '1':
      this.charMatrix = this.NUM_ONE;
      break;
	case '2':
      this.charMatrix = this.NUM_TWO;
      break;
	case '3':
      this.charMatrix = this.NUM_THREE;
      break;
	case '4':
      this.charMatrix = this.NUM_FOUR;
      break;
	case '5':
      this.charMatrix = this.NUM_FIVE;
      break;
	case '6':
      this.charMatrix = this.NUM_SIX;
      break;
	case '7':
      this.charMatrix = this.NUM_SEVEN;
      break;
	case '8':
      this.charMatrix = this.NUM_EIGHT;
      break;
	case '9':
      this.charMatrix = this.NUM_NINE;
      break;
	case 'A':
      this.charMatrix = this.CHAR_A;
      break;
	
  }
  return this.charMatrix;
};

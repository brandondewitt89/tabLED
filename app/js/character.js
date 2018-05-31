function Character(color, charString) {
  this.color            = color;
  this.charString       = charString;

  this.previousColor    = null;
  this.charMatrix       = [];
  
	this.NUM_ZERO  = [ [0, 1], [0, 2], [0, 3], [1, 0], [1, 4], [2, 1], [2, 2], [2, 3] ];
	this.NUM_ONE   = [ [0, 1], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 4] ];
	this.NUM_TWO   = [ [0, 0], [0, 3], [0, 4], [1, 0], [1, 2], [1, 4], [2, 1], [2, 4] ];
	this.NUM_THREE = [ [0, 0], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.NUM_FOUR  = [ [0, 0], [0, 1], [0, 2], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.NUM_FIVE  = [ [0, 0], [0, 1], [0, 2], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 2], [2, 3] ];
	this.NUM_SIX   = [ [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 2], [2, 3], [2, 4] ];
	this.NUM_SEVEN = [ [0, 0], [0, 3], [0, 4], [1, 0], [1, 2], [2, 0], [2, 1] ];
	this.NUM_EIGHT = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.NUM_NINE  = [ [0, 0], [0, 1], [0, 2], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3] ];
	this.CHAR_A    = [ [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_B    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [1, 4], [2, 1], [2, 2], [2, 3] ];
	this.CHAR_C    = [ [0, 1], [0, 2], [0, 3], [1, 0], [1, 4], [2, 0], [2, 4] ];
	this.CHAR_D    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 4], [2, 1], [2, 2], [2, 3] ];
	this.CHAR_E    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 4] ];
	this.CHAR_F    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [2, 0] ];
	this.CHAR_G    = [ [0, 1], [0, 2], [0, 3], [1, 0], [1, 4], [2, 0], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_H    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_I    = [ [0, 0], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 4] ];
	this.CHAR_J    = [ [0, 0], [0, 3], [1, 0], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3] ];
	this.CHAR_K    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [2, 0], [2, 1], [2, 3], [2, 4] ];
	this.CHAR_L    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4] ];
	this.CHAR_M    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_N    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 1], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_O    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_P    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2] ];
	this.CHAR_Q    = [ [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 4] ];
	this.CHAR_R    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 0], [1, 2], [2, 1], [2, 3], [2, 4] ];
	this.CHAR_S    = [ [0, 1], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 3] ];
	this.CHAR_T    = [ [0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0] ];
	this.CHAR_U    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_V    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2] ];
	this.CHAR_W    = [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ];
	this.CHAR_X    = [ [0, 0], [0, 1], [0, 3], [0, 4], [1, 2], [1, 3], [2, 0], [2, 1], [2, 3], [2, 4] ];
	this.CHAR_Y    = [ [0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2] ];
	this.CHAR_Z    = [ [0, 0], [0, 3], [0, 4], [1, 0], [1, 2], [1, 4], [2, 0], [2, 1], [2, 4] ];
	this.CHAR_EXP  = [ [2, 0], [2, 1], [2, 2], [2, 4] ];
	this.CHAR_PER  = [ [2, 4] ];
	this.CHAR_QUE  = [ [0, 0], [1, 0], [1, 2], [1, 4], [2, 0], [2, 1], [2, 2] ];
	this.CHAR_COM  = [ [1, 3], [2, 3], [2, 4] ];
	
	
	
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
	case 'B':
      this.charMatrix = this.CHAR_B;
      break;
	case 'C':
      this.charMatrix = this.CHAR_C;
      break;
	case 'D':
      this.charMatrix = this.CHAR_D;
      break;
	case 'E':
      this.charMatrix = this.CHAR_E;
      break;
	case 'F':
      this.charMatrix = this.CHAR_F;
      break;
	case 'G':
      this.charMatrix = this.CHAR_G;
      break;
	case 'H':
      this.charMatrix = this.CHAR_H;
      break;
	case 'I':
      this.charMatrix = this.CHAR_I;
      break;
	case 'J':
      this.charMatrix = this.CHAR_J;
      break;
	case 'K':
      this.charMatrix = this.CHAR_K;
      break;
	case 'L':
      this.charMatrix = this.CHAR_L;
      break;
	case 'M':
      this.charMatrix = this.CHAR_M;
      break;
	case 'N':
      this.charMatrix = this.CHAR_N;
      break;
	case 'O':
      this.charMatrix = this.CHAR_O;
      break;
	case 'P':
      this.charMatrix = this.CHAR_P;
      break;
	case 'Q':
      this.charMatrix = this.CHAR_Q;
      break;
	case 'R':
      this.charMatrix = this.CHAR_R;
      break;
	case 'S':
      this.charMatrix = this.CHAR_S;
      break;
	case 'T':
      this.charMatrix = this.CHAR_T;
      break;
	case 'U':
      this.charMatrix = this.CHAR_U;
      break;
	case 'V':
      this.charMatrix = this.CHAR_V;
      break;
	case 'W':
      this.charMatrix = this.CHAR_W;
      break;
	case 'X':
      this.charMatrix = this.CHAR_X;
      break;
	case 'Y':
      this.charMatrix = this.CHAR_Y;
      break;
	case 'Z':
      this.charMatrix = this.CHAR_Z;
      break;
	case '!':
      this.charMatrix = this.CHAR_EXP;
      break;
	case '.':
      this.charMatrix = this.CHAR_PER;
      break;
	case '?':
      this.charMatrix = this.CHAR_QUE;
      break;
	case ',':
      this.charMatrix = this.CHAR_COM;
      break;
	
	
	
	
	
  }
  return this.charMatrix;
};

Character.prototype.shiftChar = function (shiftByX, shiftByY) {
	let charMatrixShifted = [];
	for (let [i, j] of this.charMatrix) {
		i += shiftByX;
		j += shiftByY;
		charMatrixShifted = charMatrixShifted.concat([[i, j]])
	}
	this.charMatrix = charMatrixShifted
	return this.charMatrix;
}


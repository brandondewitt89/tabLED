(function () {

  class BrowserDisplay {

    constructor(width, height) {

      const board = document.querySelector('#board');
      this._canvas = document.createElement('canvas');
      this._canvas.style.width = '100%';
      this._canvas.style.height = '100%';
      board.appendChild(this._canvas);
      const dim = this._canvas.getBoundingClientRect();
      this._canvas.width = dim.width;
      this._canvas.height = dim.height;
      this._ctx = this._canvas.getContext('2d');
      this._width = width;
      this._height = height;
      this._cellSize = dim.width / width;
      this._padding = .05 * this._cellSize;
    }

    render(buffer) {
      if (buffer.length !== this._width * this._height) {
        throw "Incorrect buffer length";
      }
      const ctx = this._ctx;

      ctx.clearRect(0, 0, this._canvas.width,
        this._canvas.height);

      for (let y = 0; y < this._height; y++) {
        for (let x = 0; x < this._width; x++) {
          let color = buffer[y * this._width + x].toString(16);
          while (color.length < 6) {
            color = '0' + color;
          }
          ctx.fillStyle = '#' + color;
          ctx.fillRect(
            x * this._cellSize,
            y * this._cellSize,
            this._cellSize - this._padding,
            this._cellSize - this._padding);
        }
      }
    }
  }

  window.BrowserDisplay = BrowserDisplay;

}());

(function () {

  class TableDisplay {

    constructor(width, height) {
      this._width = width;
      this._height = height;

      const host = '192.168.0.24';
      const port = '81';

      const address = 'ws://'+host+':'+port;
      this._socket = new WebSocket(address);
      this._ready = false;
      this._socket.addEventListener('open', (event) => {
        this._ready = true;
      });
    }

    render(buffer) {
      if (buffer.length !== this._width * this._height) {
        throw "Incorrect buffer length";
      }

      if (this._ready === true) {
        this._socket.send(buffer);
      }
    }
  }

  window.TableDisplay = TableDisplay;

}());

(function() {

  class tabLED {

    constructor(host, port) {

      const address = 'ws://'+host+':'+port;

      this._socket = new WebSocket(address);

      this._ready = false;

      this._socket.addEventListener('open', (event) => {
        this._ready = true;
      });
    }

    draw(buffer) {

      if (this._ready === true) {
        this._socket.send(buffer);
      }
    }
  }

  window.tabLED = tabLED;

}());

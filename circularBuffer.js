class CircularBuffer {
    constructor(size) {
      this.size = size;
      this.buffer = [];
    }
  
    push(item) {
      if (this.buffer.length === this.size) {
        this.buffer.shift();
      }
      this.buffer.push(item);
    }
  
    values() {
      return this.buffer;
    }
  
    isFull() {
      return this.buffer.length === this.size;
    }
  }
  
  module.exports = CircularBuffer;
  
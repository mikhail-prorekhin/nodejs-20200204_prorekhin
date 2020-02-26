const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    const { limit } = options;
    this.limit = limit;
    this.count = 0;
  }

  _transform(chunk, encoding, callback) {
    const size = chunk.toString().length;
    if (this.count + size > this.limit) {
      this.emit("error", new LimitExceededError());
    }
    this.count += size;
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;

const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.rest = "";
  }

  _transform(chunk, encoding, callback) {
    const inputString = this.rest + chunk.toString();
    const arr = inputString.split(os.EOL);
    if (arr.length > 1) {
      for (let i = 0; i < arr.length - 1; i++) {
        callback(null, arr[i]);
      }
    } else {
      callback(null, null);
    }
    this.rest = arr[arr.length - 1];
  }

  _flush(callback) {
    callback(null, this.rest);
  }
}

module.exports = LineSplitStream;

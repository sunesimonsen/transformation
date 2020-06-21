const { emitAll, map, pipeline } = require("@transformation/core");
const Chunk = require("./Chunk");

const fromStream = readableStream =>
  pipeline(
    emitAll(readableStream),
    !readableStream._readableState.objectMode &&
      map(data => new Chunk(data, readableStream._readableState.encoding))
  );

module.exports = fromStream;

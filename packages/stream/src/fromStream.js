const { step } = require("@transformation/core");
const Chunk = require("./Chunk");

const fromStream = (...readableStreams) =>
  step(async ({ take, put, CLOSED }) => {
    for (const readableStream of readableStreams) {
      const objectMode = readableStream._readableState.objectMode;

      if (objectMode) {
        for await (const data of readableStream) {
          await put(data);
        }
      } else {
        for await (const data of readableStream) {
          await put(new Chunk(data, readableStream._readableState.encoding));
        }
      }
    }
  });

module.exports = fromStream;

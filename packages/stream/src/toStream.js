const { step } = require("@transformation/core");
const Chunk = require("./Chunk");

const write = (stream, data, encoding) =>
  new Promise(resolve => {
    if (!stream.write(data, encoding)) {
      stream.once("drain", resolve);
    } else {
      process.nextTick(resolve);
    }
  });

const toStream = writableStream =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) {
        writableStream.end();
        break;
      }

      const isChunk = value instanceof Chunk;

      if (isChunk) {
        await write(writableStream, value.data, value.encoding);
      } else {
        await write(
          writableStream,
          value,
          typeof value === "string" ? "utf8" : null
        );
      }

      await put(value);
    }
  });

module.exports = toStream;

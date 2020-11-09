const { step } = require("@transformation/core");
const Chunk = require("./Chunk");
const { PassThrough, Writable } = require("stream");

const write = (stream, data, encoding) =>
  new Promise((resolve) => {
    if (!stream.write(data, encoding)) {
      stream.once("drain", resolve);
    } else {
      process.nextTick(resolve);
    }
  });

const pipe = (transformStream) =>
  step(async ({ take, put, CLOSED }) => {
    await new Promise((resolve, reject) => {
      const run = async () => {
        const objectMode = transformStream._readableState.objectMode;

        let stream;

        while (true) {
          const value = await take();
          if (value === CLOSED) {
            if (stream) {
              stream.end();
            } else {
              resolve();
            }
            break;
          }

          const isChunk = value instanceof Chunk;

          if (!stream) {
            stream = new PassThrough();

            if (isChunk) {
              if (value.encoding) {
                stream.setEncoding(value.encoding);
              }
            } else if (typeof value === "string") {
              stream.setEncoding("utf8");
            }

            stream._readableState.objectMode = !isChunk;
            stream._writableState.objectMode = !isChunk;

            stream
              .pipe(transformStream)
              .on("error", reject)
              .pipe(
                new Writable({
                  write: objectMode
                    ? (data, encoding, callback) => {
                        put(data).then(() => callback());
                      }
                    : (data, encoding, callback) => {
                        put(new Chunk(data, encoding)).then(() => callback());
                      },
                  objectMode: true,
                })
              )
              .on("error", reject)
              .on("finish", resolve);
          }

          if (isChunk) {
            await write(stream, value.data, value.encoding);
          } else {
            await write(stream, value);
          }
        }
      };

      run().catch(reject);
    });
  });

module.exports = pipe;

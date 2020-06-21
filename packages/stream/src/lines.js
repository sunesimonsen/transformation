const { step } = require("@transformation/core");
const Chunk = require("./Chunk");
const lineBoundaryRegex = require("./lineBoundaryRegex.js");

const lines = () =>
  step(async ({ take, put, CLOSED }) => {
    let buffered = "";
    while (true) {
      const value = await take();
      if (value === CLOSED) {
        await put(buffered);
        break;
      }

      const isChunk = value instanceof Chunk;

      if (!isChunk && typeof value !== "string") {
        throw new Error(
          "The lines transformation requires chunks or strings as input"
        );
      }

      let text = value;
      if (isChunk) {
        const { data, encoding } = value;

        text = Buffer.isBuffer(data) ? data.toString(encoding || "utf8") : data;
      }

      const lines = `${buffered}${text}`.split(lineBoundaryRegex);

      for (const line of lines.slice(0, -1)) {
        await put(line);
      }

      buffered = lines[lines.length - 1] || "";
    }
  });

module.exports = lines;

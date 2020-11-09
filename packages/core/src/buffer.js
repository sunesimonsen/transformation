const { go, close, CLOSED, chan, put, take, buffers } = require("medium");
const channelStep = require("./channelStep");

const buffer = (size, strategy = "fixed") =>
  channelStep((input) => {
    const output = chan(buffers[strategy](size));

    go(async () => {
      while (true) {
        const value = await take(input);
        if (value === CLOSED) break;
        await put(output, value);
      }
      close(output);
    });

    return output;
  });

module.exports = buffer;

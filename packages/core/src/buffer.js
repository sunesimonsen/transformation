const { go, close, CLOSED, chan, put, take } = require("medium");
const { fixed, dropping, sliding } = require("medium/lib/buffers");
const channelStep = require("./channelStep");

const buffers = {
  fixed,
  dropping,
  sliding,
};

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

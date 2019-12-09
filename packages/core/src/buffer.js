const { go, close, CLOSED, chan, put, take, buffers } = require("medium");

const buffer = (size, strategy = "fixed") => input => {
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
};

module.exports = buffer;

const { go, close, CLOSED, chan, put, take } = require("medium");

const delay = ms => input => {
  const output = chan();

  go(async () => {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, ms));

      const value = await take(input);
      if (value === CLOSED) break;
      await put(output, value);
    }
    close(output);
  });

  return output;
};

module.exports = delay;

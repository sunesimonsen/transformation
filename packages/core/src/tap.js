const { go, close, CLOSED, chan, put, take } = require("medium");

const tap = selector => input => {
  const output = chan();

  go(async () => {
    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;

      if (selector) {
        console.log(selector(value));
      } else {
        console.log(value);
      }

      await put(output, value);
    }
    close(output);
  });

  return output;
};

module.exports = tap;

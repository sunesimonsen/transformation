const { go, close, CLOSED, chan, put, take } = require("medium");

const splitArrays = () => input => {
  const output = chan();

  go(async () => {
    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;

      if (Array.isArray(value)) {
        for (let item of value) {
          await put(output, item);
        }
      } else {
        await put(output, value);
      }
    }
    close(output);
  });

  return output;
};

module.exports = splitArrays;

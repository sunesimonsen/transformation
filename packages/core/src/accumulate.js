const { go, close, CLOSED, chan, put, take } = require("medium");

const map = (mapper, initialValue) => input => {
  const output = chan();

  go(async () => {
    let lastResult = initialValue;
    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;
      lastResult = await mapper(value, lastResult);
      await put(output, lastResult);
    }
    close(output);
  });

  return output;
};

module.exports = map;

const { go, close, CLOSED, chan, put, take } = require("medium");

const forEach = callback => input => {
  const output = chan();

  go(async () => {
    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;
      await callback(value);
      await put(output, value);
    }
    close(output);
  });

  return output;
};

module.exports = forEach;

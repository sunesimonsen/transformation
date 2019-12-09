const { go, close, CLOSED, chan, put, take } = require("medium");

const map = mapper => input => {
  const output = chan();

  go(async () => {
    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;
      await put(output, await mapper(value));
    }
    close(output);
  });

  return output;
};

module.exports = map;

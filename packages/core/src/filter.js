const { go, close, CLOSED, chan, put, take } = require("medium");

const filter = predicate => input => {
  const output = chan();

  go(async () => {
    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;
      if (await predicate(value)) {
        await put(output, value);
      }
    }
    close(output);
  });

  return output;
};

module.exports = filter;

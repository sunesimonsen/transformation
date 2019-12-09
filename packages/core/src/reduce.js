const { go, close, CLOSED, chan, put, take } = require("medium");

const reduce = (accumulator, initialValue) => input => {
  const output = chan();

  go(async () => {
    let accumulation = initialValue;

    while (true) {
      const value = await take(input);
      if (value === CLOSED) break;
      accumulation = accumulator(accumulation, value);
    }

    await put(output, accumulation);
    close(output);
  });

  return output;
};

module.exports = reduce;

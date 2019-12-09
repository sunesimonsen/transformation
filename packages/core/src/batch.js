const { go, close, CLOSED, chan, put, take } = require("medium");

const batch = size => input => {
  const output = chan();

  go(async () => {
    while (true) {
      let valeu;
      const nextBatch = [];
      for (var i = 0; i < size; i += 1) {
        value = await take(input);
        if (value === CLOSED) break;
        nextBatch.push(value);
      }

      await put(output, nextBatch);

      if (value === CLOSED) break;
    }

    close(output);
  });

  return output;
};

module.exports = batch;

const { go, close, CLOSED, chan, put, take } = require("medium");

const batch = size => input => {
  const output = chan();

  go(async () => {
    let batchNumber = 0;
    while (true) {
      let value;
      const nextBatch = [];
      for (let i = 0; i < size; i += 1) {
        value = await take(input);
        if (value === CLOSED) break;
        nextBatch.push(value);
      }

      const start = batchNumber * size;
      const end = start + size - 1;
      batchNumber++;

      await put(output, {
        key: `[${start};${end}]`,
        items: nextBatch
      });

      if (value === CLOSED) break;
    }

    close(output);
  });

  return output;
};

module.exports = batch;

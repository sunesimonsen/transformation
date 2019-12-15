const { go, close, CLOSED, chan, put, take } = require("medium");

const batchBy = fieldOrSelector => input => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  const output = chan();

  go(async () => {
    let batchKey = null;
    let nextBatch = [];
    while (true) {
      const value = await take(input);
      if (value === CLOSED) {
        await put(output, {
          key: batchKey,
          items: nextBatch
        });
        break;
      }

      const currentKey = selector(value);
      batchKey = batchKey || currentKey;
      if (batchKey === currentKey) {
        nextBatch.push(value);
      } else {
        await put(output, {
          key: batchKey,
          items: nextBatch
        });

        batchKey = currentKey;
        nextBatch = [value];
      }
    }

    close(output);
  });

  return output;
};

module.exports = batchBy;

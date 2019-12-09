const { go, close, chan, put } = require("medium");

const emitItems = (...items) => {
  const output = chan(items.length);

  go(async () => {
    for (let item of items) {
      await put(output, item);
    }
    close(output);
  });

  return output;
};

module.exports = emitItems;

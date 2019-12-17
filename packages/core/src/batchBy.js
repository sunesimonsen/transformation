const step = require("./step");
const Group = require("./Group");

const batchBy = fieldOrSelector =>
  step(async (take, put, CLOSED) => {
    const selector =
      typeof fieldOrSelector === "string"
        ? value => value[fieldOrSelector]
        : fieldOrSelector;

    let batchKey = null;
    let nextBatch = [];
    while (true) {
      const value = await take();
      if (value === CLOSED) {
        await put(
          Group.create({
            key: batchKey,
            items: nextBatch
          })
        );
        break;
      }

      const currentKey = selector(value);
      batchKey = batchKey || currentKey;
      if (batchKey === currentKey) {
        nextBatch.push(value);
      } else {
        await put(
          Group.create({
            key: batchKey,
            items: nextBatch
          })
        );

        batchKey = currentKey;
        nextBatch = [value];
      }
    }
  });

module.exports = batchBy;

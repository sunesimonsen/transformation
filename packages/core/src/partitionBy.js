const step = require("./step");
const Group = require("./Group");

const partitionBy = fieldOrSelector => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  return step(async ({ take, put, CLOSED }) => {
    let partitionKey = null;
    let nextBatch = [];
    while (true) {
      const value = await take();
      if (value === CLOSED) {
        await put(
          Group.create({
            key: partitionKey,
            items: nextBatch
          })
        );
        break;
      }

      const currentKey = selector(value);
      partitionKey = partitionKey || currentKey;
      if (partitionKey === currentKey) {
        nextBatch.push(value);
      } else {
        await put(
          Group.create({
            key: partitionKey,
            items: nextBatch
          })
        );

        partitionKey = currentKey;
        nextBatch = [value];
      }
    }
  });
};

module.exports = partitionBy;

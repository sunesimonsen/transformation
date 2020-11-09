const step = require("./step");
const Group = require("./Group");

const partition = (size) =>
  step(async ({ take, put, CLOSED }) => {
    let partitionNumber = 0;
    while (true) {
      let value;
      const nextBatch = [];
      for (let i = 0; i < size; i += 1) {
        value = await take();
        if (value === CLOSED) break;
        nextBatch.push(value);
      }

      const start = partitionNumber * size;
      const end = start + size - 1;
      partitionNumber++;

      await put(
        Group.create({
          key: `[${start};${end}]`,
          items: nextBatch,
        })
      );

      if (value === CLOSED) break;
    }
  });

module.exports = partition;

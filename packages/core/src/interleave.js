const step = require("./step");

const interleave = (...separators) =>
  step(async ({ take, put, CLOSED }) => {
    let i = 0;
    let isFirst = true;

    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      if (isFirst) {
        isFirst = false;
      } else {
        await put(separators[i % separators.length]);
        i++;
      }

      await put(value);
    }
  });

module.exports = interleave;

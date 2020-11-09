const step = require("./step");

const prependItems = (...items) =>
  step(async ({ take, put, CLOSED }) => {
    for (const item of items) {
      await put(item);
    }

    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(value);
    }
  });

module.exports = prependItems;

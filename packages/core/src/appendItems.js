const step = require("./step");

const appendItems = (...items) =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(value);
    }

    for (const item of items) {
      await put(item);
    }
  });

module.exports = appendItems;

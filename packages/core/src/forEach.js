const step = require("./step");

const forEach = callback =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await callback(value);
      await put(value);
    }
  });

module.exports = forEach;

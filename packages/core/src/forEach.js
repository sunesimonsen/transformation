const step = require("./step");

const forEach = (callback) =>
  step(async ({ take, put, CLOSED }) => {
    let i = 0;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await callback(value, i++);
      await put(value);
    }
  });

module.exports = forEach;

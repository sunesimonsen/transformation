const step = require("./step");

const cleanup = (callback) =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(value);
    }
    await callback();
  });

module.exports = cleanup;

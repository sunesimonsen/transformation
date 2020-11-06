const step = require("./step");

const setup = callback =>
  step(async ({ take, put, CLOSED }) => {
    await callback();
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(value);
    }
  });

module.exports = setup;

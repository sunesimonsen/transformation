const step = require("./step");

const throttle = (ms) =>
  step(async ({ take, put, CLOSED }) => {
    let last;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      if (!last || Date.now() - last > ms) {
        await put(value);
        last = Date.now();
      }
    }
  });

module.exports = throttle;

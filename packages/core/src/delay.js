const { sleep } = require("medium");
const step = require("./step");

const delay = (ms) =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      await sleep(ms);

      const value = await take();
      if (value === CLOSED) break;
      await put(value);
    }
  });

module.exports = delay;

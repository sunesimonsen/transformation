const step = require("./step");

const map = mapper =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(await mapper(value));
    }
  });

module.exports = map;

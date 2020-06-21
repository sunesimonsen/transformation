const step = require("./step");

const map = mapper =>
  step(async ({ take, put, CLOSED }) => {
    let i = 0;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      await put(await mapper(value, i++));
    }
  });

module.exports = map;

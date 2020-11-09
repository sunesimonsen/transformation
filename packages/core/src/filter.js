const step = require("./step");

const filter = (predicate) =>
  step(async ({ take, put, CLOSED }) => {
    let i = 0;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      if (await predicate(value, i++)) {
        await put(value);
      }
    }
  });

module.exports = filter;

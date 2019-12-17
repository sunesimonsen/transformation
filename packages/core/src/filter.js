const step = require("./step");

const filter = predicate =>
  step(async (take, put, CLOSED) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      if (await predicate(value)) {
        await put(value);
      }
    }
  });

module.exports = filter;

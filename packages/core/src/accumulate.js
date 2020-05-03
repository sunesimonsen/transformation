const step = require("./step");

const accululate = (mapper, initialValue) =>
  step(async ({ take, put, CLOSED }) => {
    let lastResult = initialValue;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      lastResult = await mapper(value, lastResult);
      await put(lastResult);
    }
  });

module.exports = accululate;

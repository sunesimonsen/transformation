const step = require("./step");

const reduce = (accumulator, initialValue) =>
  step(async ({ take, put, CLOSED }) => {
    let i = 0;
    let accumulation = initialValue;

    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      accumulation = await accumulator(accumulation, value, i++);
    }

    await put(accumulation);
  });

module.exports = reduce;

const step = require("./step");

const skipLast = (count = 1) => {
  if (count <= 0) {
    return false;
  }

  return step(async ({ take, put, CLOSED }) => {
    const buffer = [];

    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      if (buffer.length === count) {
        await put(buffer.pop());
      }
      buffer.unshift(value);
    }
  });
};

module.exports = skipLast;

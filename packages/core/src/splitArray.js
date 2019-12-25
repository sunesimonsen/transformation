const step = require("./step");

const splitArray = () =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      if (Array.isArray(value)) {
        for (let item of value) {
          await put(item);
        }
      } else {
        await put(value);
      }
    }
  });

module.exports = splitArray;

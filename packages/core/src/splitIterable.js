const step = require("./step");

const splitIterable = () =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      const isIterable =
        value &&
        (typeof value[Symbol.iterator] === "function" ||
          typeof value[Symbol.asyncIterator] === "function");

      if (isIterable) {
        for await (let item of value) {
          await put(item);
        }
      } else {
        await put(value);
      }
    }
  });

module.exports = splitIterable;

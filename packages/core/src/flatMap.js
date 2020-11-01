const step = require("./step");

const flatMap = mapper =>
  step(async ({ take, put, CLOSED }) => {
    let i = 0;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      const result = await mapper(value, i++);

      const isIterable =
        result &&
        typeof result !== "string" &&
        (typeof result[Symbol.iterator] === "function" ||
          typeof result[Symbol.asyncIterator] === "function");

      if (isIterable) {
        for await (let item of result) {
          await put(item);
        }
      } else {
        await put(result);
      }
    }
  });

module.exports = flatMap;

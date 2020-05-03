const step = require("./step");

const tap = fieldOrSelector => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  return step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      if (selector) {
        console.log(selector(value));
      } else {
        console.log(value);
      }

      await put(value);
    }
  });
};

module.exports = tap;

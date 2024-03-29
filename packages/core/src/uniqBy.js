const step = require("./step");

const uniqBy = (fieldOrSelector, options = {}) => {
  const selector =
    typeof fieldOrSelector === "string"
      ? (value) => value[fieldOrSelector]
      : fieldOrSelector;

  return step(async ({ take, put, CLOSED }) => {
    const seen = new Set();

    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      const selected = selector(value);
      if (!seen.has(selected)) {
        seen.add(selected);
        await put(value);
      }
    }
  });
};

module.exports = uniqBy;

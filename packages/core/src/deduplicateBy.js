const step = require("./step");

const deduplicateBy = (fieldOrSelector) => {
  const selector =
    typeof fieldOrSelector === "string"
      ? (value) => value[fieldOrSelector]
      : fieldOrSelector;

  return step(async ({ take, put, CLOSED }) => {
    let i = 0;
    let last;
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      const selected = selector(value);
      if (i > 0 && last !== selected) {
        await put(value);
        last = selected;
      }
      i++;
    }
  });
};

module.exports = deduplicateBy;

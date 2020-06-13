const filter = require("./filter");

const uniqBy = fieldOrSelector => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  const seen = new Set();

  return filter(item => {
    const selected = selector(item);
    const newItem = !seen.has(selected);
    if (newItem) {
      seen.add(selected);
    }

    return newItem;
  });
};

module.exports = uniqBy;

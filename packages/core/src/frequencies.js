const reduce = require("./reduce");

module.exports = (fieldOrSelector = v => v) => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  return reduce((result, item) => {
    const key = selector(item);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
};

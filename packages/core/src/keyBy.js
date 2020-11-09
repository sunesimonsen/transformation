const reduce = require("./reduce");

module.exports = (fieldOrSelector) => {
  const selector =
    typeof fieldOrSelector === "string"
      ? (value) => value[fieldOrSelector]
      : fieldOrSelector;

  return reduce((result, item) => {
    result[selector(item)] = item;
    return result;
  }, {});
};

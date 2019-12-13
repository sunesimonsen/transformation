const reduce = require("./reduce");

const groupBy = fieldOrSelector => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  return reduce((grouping, item) => {
    const key = selector(item);
    const group = grouping[key];
    if (group) {
      group.push(item);
    } else {
      grouping[key] = [item];
    }
    return grouping;
  }, {});
};

module.exports = groupBy;

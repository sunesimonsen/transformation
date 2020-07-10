const forEach = require("./forEach");

const tap = fieldOrSelector => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  return forEach(value => {
    if (selector) {
      console.log(selector(value));
    } else {
      console.log(value);
    }
  });
};

module.exports = tap;

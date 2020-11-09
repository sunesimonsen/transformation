const chose = require("./chose");
const pipeline = require("./pipeline");

const when = (predicateOrBool, ...steps) => {
  if (typeof predicateOrBool === "function") {
    const selector = (value) => (predicateOrBool(value) ? "true" : "false");
    return chose(selector, { true: pipeline(...steps) });
  }

  if (predicateOrBool) {
    return pipeline(...steps);
  }
};

module.exports = when;

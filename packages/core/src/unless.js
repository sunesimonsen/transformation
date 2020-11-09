const chose = require("./chose");
const pipeline = require("./pipeline");

const unless = (predicateOrBool, ...steps) => {
  if (typeof predicateOrBool === "function") {
    const selector = (value) => (predicateOrBool(value) ? "true" : "false");
    return chose(selector, { false: pipeline(...steps) });
  }

  if (!predicateOrBool) {
    return pipeline(...steps);
  }
};

module.exports = unless;

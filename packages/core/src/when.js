const chose = require("./chose");
const pipeline = require("./pipeline");

const when = (predicate, ...steps) =>
  chose(value => (predicate(value) ? "true" : "false"), {
    true: pipeline(...steps)
  });

module.exports = when;

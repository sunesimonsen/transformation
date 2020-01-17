const when = require("./when");

const unless = (predicate, ...steps) =>
  when(value => !predicate(value), ...steps);

module.exports = unless;

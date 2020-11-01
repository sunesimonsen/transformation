const pipeline = require("./pipeline");
const toArray = require("./toArray");
const splitIterable = require("./splitIterable");

const join = separator =>
  pipeline(toArray(), arr => arr.join(separator), splitIterable());

module.exports = join;

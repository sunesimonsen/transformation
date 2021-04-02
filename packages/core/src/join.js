const pipeline = require("./pipeline");
const toArray = require("./toArray");

const join = (separator) => pipeline(toArray(), (arr) => arr.join(separator));

module.exports = join;

const pipeline = require("./pipeline");
const toArray = require("./toArray");
const splitIterable = require("./splitIterable");
const map = require("./map");

const sort = comparison => {
  return pipeline(
    toArray(),
    map(arr => arr.sort(comparison)),
    splitIterable()
  );
};

module.exports = sort;

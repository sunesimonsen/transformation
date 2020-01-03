const pipeline = require("./pipeline");
const toArray = require("./toArray");
const splitArray = require("./splitArray");
const map = require("./map");

const sort = comparison => {
  return pipeline(
    toArray(),
    map(arr => arr.sort(comparison)),
    splitArray()
  );
};

module.exports = sort;

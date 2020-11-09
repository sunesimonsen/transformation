const pipeline = require("./pipeline");
const toArray = require("./toArray");
const splitIterable = require("./splitIterable");
const map = require("./map");

const reverse = (comparison) => {
  return pipeline(
    toArray(),
    map((arr) => arr.reverse()),
    splitIterable()
  );
};

module.exports = reverse;

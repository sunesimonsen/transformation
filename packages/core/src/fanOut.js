const { merge } = require("medium");
const buffer = require("./buffer");

const fanOut = (step, count) => input => {
  const outputs = [];
  for (var i = 0; i < count; i += 1) {
    outputs.push(step(input));
  }

  return buffer(count)(merge(...outputs));
};

module.exports = fanOut;

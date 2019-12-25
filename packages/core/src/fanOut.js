const { merge } = require("medium");
const buffer = require("./buffer");
const channelStep = require("./channelStep");

const fanOut = (step, count) =>
  channelStep((input, errors) => {
    const outputs = [];
    for (var i = 0; i < count; i += 1) {
      outputs.push(step(input, errors));
    }

    return buffer(count)(merge(...outputs));
  });

module.exports = fanOut;

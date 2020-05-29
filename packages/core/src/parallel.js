const { merge } = require("medium");
const buffer = require("./buffer");
const channelStep = require("./channelStep");

const parallel = (step, concurrency) =>
  channelStep((input, errors) => {
    const outputs = [];
    for (var i = 0; i < concurrency; i += 1) {
      outputs.push(step.body(input, errors));
    }

    return buffer(concurrency).body(merge(...outputs));
  });

module.exports = parallel;

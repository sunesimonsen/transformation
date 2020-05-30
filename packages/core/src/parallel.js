const { merge } = require("medium");
const buffer = require("./buffer");
const channelStep = require("./channelStep");
const os = require("os");
const cpus = os.cpus().length;

const parallel = (step, concurrency = 2 * cpus) =>
  channelStep((input, errors) => {
    const outputs = [];
    for (var i = 0; i < concurrency; i += 1) {
      outputs.push(step.body(input, errors));
    }

    return buffer(concurrency).body(merge(...outputs));
  });

module.exports = parallel;

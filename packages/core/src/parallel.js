const { go, take, close, chan, merge, put, CLOSED } = require("medium");
const buffer = require("./buffer");
const channelStep = require("./channelStep");

const cpus =
  typeof module !== "undefined" && module.exports
    ? require("os").cpus().length
    : 4;

const parallel = (step, concurrency = 2 * cpus) =>
  channelStep((input, errors) => {
    const parallelErrors = chan(0);
    const outputs = [];
    for (var i = 0; i < concurrency; i += 1) {
      outputs.push(step.body(input, parallelErrors));
    }

    go(async () => {
      while (true) {
        const value = await take(parallelErrors);
        if (value === CLOSED) break;
        close(input);
        await put(errors, value);
      }
    });

    return buffer(concurrency).body(merge(...outputs));
  });

module.exports = parallel;

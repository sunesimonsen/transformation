const { go, close, CLOSED, chan, put, take } = require("medium");
const pipeline = require("./pipeline");
const flush = require("./flush");
const channelStep = require("./channelStep");

const fork = (...steps) =>
  channelStep((input, errors) => {
    const output = chan();
    const forkedInput = chan();
    const forkedOutput = pipeline(...steps)(forkedInput, errors);
    let readInput = false;
    let readForkedOutput = false;

    go(async () => {
      await flush(forkedOutput);

      if (readInput) {
        close(output);
        close(forkedOutput);
      }

      readForkedOutput = true;
    });

    go(async () => {
      while (true) {
        const value = await take(input);
        await put(forkedInput, value);
        if (value === CLOSED) break;
        await put(output, value);
      }

      if (readForkedOutput) {
        close(output);
        close(forkedOutput);
      }

      readInput = true;
    });

    return output;
  });

module.exports = fork;

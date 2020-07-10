const { go, close, CLOSED, chan, put, take } = require("medium");
const pipeline = require("./pipeline");
const flush = require("./flush");
const channelStep = require("./channelStep");

const fork = (...steps) =>
  channelStep((input, errors) => {
    const output = chan();
    const forkedInput = chan();
    const forkedOutput = pipeline(...steps).body(forkedInput, errors);
    let readInput = false;
    let readForkedOutput = false;

    go(async () => {
      try {
        await flush(forkedOutput);
      } catch (e) {
        await put(errors, e);
      }

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
        const open = await put(output, value);
        if (!open) break;
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

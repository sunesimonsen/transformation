const { go, take, close, chan, merge, put, CLOSED } = require("medium");
const buffer = require("./buffer");
const channelStep = require("./channelStep");
const program = require("./program");
const emitItems = require("./emitItems");
const forEach = require("./forEach");
const step = require("./step");

const cpus =
  typeof module !== "undefined" && module.exports
    ? require("os").cpus().length
    : 4;

const worker = (childStep) =>
  step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      const { index, data } = value;

      await program(
        emitItems(data),
        childStep,
        forEach((v) => put({ index, data: v }))
      );

      await put({ index, data: CLOSED });
    }
  });

const parallel = (step, concurrency = 2 * cpus) => {
  if (concurrency < 2) return step;

  return channelStep((input, errors) => {
    const outputs = [];
    const output = chan(concurrency);
    const parallelInput = chan();

    for (let i = 0; i < concurrency; i += 1) {
      outputs.push(worker(step).body(parallelInput, errors));
    }

    const parallelOutput = buffer(concurrency).body(merge(...outputs));

    go(async () => {
      let inputIndex = 0;

      while (true) {
        const value = await take(input);
        if (value === CLOSED) break;
        await put(parallelInput, { index: inputIndex++, data: value });
      }

      close(parallelInput);
    });

    go(async () => {
      let outputIndex = 0;
      const outputValues = {};
      const readyIndexes = {};

      while (true) {
        const value = await take(parallelOutput);
        if (value === CLOSED) break;
        const { index, data } = value;

        outputValues[index] = outputValues[index] || [];

        if (data === CLOSED) {
          readyIndexes[index] = true;
          while (readyIndexes[outputIndex]) {
            for (const { data } of outputValues[outputIndex]) {
              await put(output, data);
            }
            outputIndex++;
          }
        } else if (outputIndex === index) {
          await put(output, data);
        } else {
          outputValues[index].push(value);
        }
      }
      close(output);
    });

    return output;
  });
};

module.exports = parallel;

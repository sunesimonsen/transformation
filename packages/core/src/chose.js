const { go, close, CLOSED, chan, put, take } = require("medium");
const emitItems = require("./emitItems");
const program = require("./program");
const forEach = require("./forEach");
const channelStep = require("./channelStep");

const chose = (caseOrSelector, cases) => {
  if (typeof caseOrSelector !== "function") {
    return cases[caseOrSelector];
  }

  const selector = caseOrSelector;

  return channelStep((input, errors) => {
    const output = chan();

    go(async () => {
      try {
        while (true) {
          const value = await take(input);
          if (value === CLOSED || output.isClosed) break;

          const chosen = cases[selector(value)];

          if (chosen) {
            await program(
              emitItems(value),
              chosen,
              forEach((value) => put(output, value))
            );
          } else {
            await put(output, value);
          }
        }
      } catch (err) {
        await put(errors, err);
      } finally {
        close(input);
        close(output);
      }
    });

    return output;
  });
};

module.exports = chose;

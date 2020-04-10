const { go, close, CLOSED, chan, put, take, merge } = require("medium");
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");
const channelStep = require("./channelStep");

const chose = (caseOrSelector, cases) => {
  const selector =
    typeof caseOrSelector === "string" ? () => caseOrSelector : caseOrSelector;

  return channelStep((input, errors) => {
    const output = chan();

    go(async () => {
      try {
        while (true) {
          const value = await take(input);
          if (value === CLOSED) break;

          const chosen = cases[selector(value)];

          if (chosen) {
            const result = await takeAll(pipeline(emitItems(value), chosen));

            if (result.length > 1) {
              throw new Error("Cases must produce at most one value");
            } else if (result.length === 1) {
              await put(output, result[0]);
            }
          } else {
            await put(output, value);
          }
        }
      } catch (err) {
        await put(errors, err);
      } finally {
        close(output);
      }
    });

    return output;
  });
};

module.exports = chose;

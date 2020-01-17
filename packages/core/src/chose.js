const { go, close, CLOSED, chan, put, take } = require("medium");
const channelStep = require("./channelStep");

const chose = (caseOrSelector, cases) => {
  const selector =
    typeof caseOrSelector === "string" ? () => caseOrSelector : caseOrSelector;

  return channelStep((input, errors) => {
    const caseChannels = {};
    const output = chan();
    for (const [key, step] of Object.entries(cases)) {
      const caseInput = chan();
      caseChannels[key] = [caseInput, step.body(caseInput, errors)];
    }

    go(async () => {
      try {
        while (true) {
          const value = await take(input);
          if (value === CLOSED) break;
          const [caseInput, caseOutput] = caseChannels[selector(value)] || [];
          if (caseInput) {
            put(caseInput, value);
            await put(output, await take(caseOutput));
          } else {
            await put(output, value);
          }
        }
      } catch (err) {
        await put(errors, err);
      } finally {
        for (const [caseInput] of Object.values(caseChannels)) {
          close(caseInput);
        }

        close(output);
      }
    });

    return output;
  });
};

module.exports = chose;

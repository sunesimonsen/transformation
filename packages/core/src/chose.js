const { go, close, CLOSED, chan, put, take, merge } = require("medium");
const channelStep = require("./channelStep");

const chose = (caseOrSelector, cases) => {
  const selector =
    typeof caseOrSelector === "string" ? () => caseOrSelector : caseOrSelector;

  return channelStep((input, errors) => {
    const caseChannels = {};
    const output = chan();
    const outputs = [output];
    for (const [key, step] of Object.entries(cases)) {
      const caseInput = chan();
      caseChannels[key] = caseInput;
      outputs.push(step.body(caseInput, errors));
    }

    go(async () => {
      try {
        while (true) {
          const value = await take(input);
          if (value === CLOSED) break;
          const caseInput = caseChannels[selector(value)];
          if (caseInput) {
            await put(caseInput, value);
          } else {
            await put(output, value);
          }
        }
      } catch (err) {
        await put(errors, err);
      } finally {
        for (const caseInput of Object.values(caseChannels)) {
          close(caseInput);
        }

        close(output);
      }
    });

    return merge(...outputs);
  });
};

module.exports = chose;

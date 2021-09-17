const { go, close, CLOSED, chan, put, take } = require("medium");
const channelStep = require("./channelStep");

const map = (mapper) =>
  channelStep((input, errors) => {
    const output = chan();

    go(async () => {
      let i = 0;
      try {
        while (true) {
          const value = await take(input);
          if (value === CLOSED) break;

          const mappedValue = await mapper(value, i++);

          if (
            mappedValue &&
            mappedValue.type === "step" &&
            typeof mappedValue.body === "function"
          ) {
            const valueInput = chan();
            try {
              const valueOutput = mappedValue.body(valueInput, errors);
              while (true) {
                const item = await take(valueOutput);
                if (item === CLOSED) break;
                await put(output, item);
              }
            } finally {
              close(valueInput);
            }
          } else {
            await put(output, mappedValue);
          }
        }
      } catch (e) {
        await put(errors, e);
      } finally {
        close(output);
      }
    });

    return output;
  });

module.exports = map;

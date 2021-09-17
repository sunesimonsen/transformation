const { go, close, CLOSED, chan, put, take } = require("medium");
const channelStep = require("./channelStep");

const emitAll = (...iterables) =>
  channelStep((input, errors) => {
    const output = chan();
    let closing = false;

    go(async () => {
      while (true) {
        const value = await take(input);
        if (value === CLOSED) break;
      }

      closing = true;
    });

    go(async () => {
      try {
        for (const iterable of iterables) {
          if (closing) break;
          for await (const item of iterable) {
            if (closing) break;
            await put(output, item);
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

module.exports = emitAll;

const { go, close, CLOSED, chan, put, take } = require("medium");
const channelStep = require("./channelStep");

const step = (body) =>
  channelStep((input, errors) => {
    const output = chan();

    const takeWrapper = () => take(input);
    const putWrapper = async (value) => {
      const open = await put(output, value);
      if (!open) close(input);
      return open;
    };

    go(async () => {
      try {
        await body({ take: takeWrapper, put: putWrapper, CLOSED });
      } catch (err) {
        close(input);
        await put(errors, err);
      } finally {
        close(output);
      }
    });

    return output;
  });

module.exports = step;

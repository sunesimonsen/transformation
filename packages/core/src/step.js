const { go, close, CLOSED, chan, put, take } = require("medium");

const step = body => (input, errors) => {
  const output = chan();

  const takeWrapper = () => take(input);
  const putWrapper = value => put(output, value);

  go(async () => {
    try {
      await body({ take: takeWrapper, put: putWrapper, CLOSED });
    } catch (err) {
      await put(errors, err);
    } finally {
      close(output);
    }
  });

  return output;
};

module.exports = step;

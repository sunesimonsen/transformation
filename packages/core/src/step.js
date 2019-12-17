const { go, close, CLOSED, chan, put, take } = require("medium");

const step = body => input => {
  const output = chan();

  const takeWrapper = () => take(input);
  const putWrapper = value => put(output, value);

  go(async () => {
    await body(takeWrapper, putWrapper, CLOSED);
    close(output);
  });

  return output;
};

module.exports = step;

const { go, chan, close, CLOSED, take } = require("medium");

const flush = async (stepOrChannel) => {
  const input = chan();
  const errors = chan();
  const output =
    stepOrChannel.type === "step"
      ? stepOrChannel.body(input, errors)
      : stepOrChannel;

  let error = null;

  go(async () => {
    while (true) {
      const value = await take(errors);
      if (value === CLOSED) break;
      close(input);
      error = value;
    }
  });

  while (true) {
    const value = await take(output);
    if (value === CLOSED) break;
  }

  close(errors);
  if (error) throw error;
};

module.exports = flush;

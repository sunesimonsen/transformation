const { chan, CLOSED, take } = require("medium");

const flush = async stepOrChannel => {
  const input = chan();
  const errors = chan();
  const output =
    stepOrChannel.type === "step"
      ? stepOrChannel.body(input, errors)
      : stepOrChannel;

  let error = null;

  take(errors).then(e => {
    error = e;
  });

  while (true) {
    const value = await take(output);
    if (error) throw error;
    if (value === CLOSED) break;
  }
};

module.exports = flush;

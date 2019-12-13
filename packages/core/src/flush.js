const { chan, CLOSED, take, close } = require("medium");

const flush = async stepOrChannel => {
  const output =
    typeof stepOrChannel === "function" ? stepOrChannel(chan()) : stepOrChannel;

  while (true) {
    const value = await take(output);
    if (value === CLOSED) break;
  }
};

module.exports = flush;

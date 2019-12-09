const { chan } = require("medium");

const pipeline = (...steps) => input => {
  let channel = input || chan();

  steps.forEach(stepOrChannel => {
    channel =
      typeof stepOrChannel === "function"
        ? stepOrChannel(channel)
        : stepOrChannel;
  });

  return channel;
};

module.exports = pipeline;

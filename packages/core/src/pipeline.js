const { chan } = require("medium");

const pipeline = (...steps) => (input, errors) => {
  let channel = input || chan();

  steps.forEach(stepOrChannel => {
    channel =
      typeof stepOrChannel === "function"
        ? stepOrChannel(channel, errors)
        : stepOrChannel;
  });

  return channel;
};

module.exports = pipeline;

const { go, close, CLOSED, chan, put, take } = require("medium");

const channelStep = body => (input, errors) => {
  return body(input, errors);
};

module.exports = channelStep;

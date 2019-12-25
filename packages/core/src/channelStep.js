const { go, close, CLOSED, chan, put, take } = require("medium");

const channelStep = body => ({
  type: "step",
  body
});

module.exports = channelStep;

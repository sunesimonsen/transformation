const { go, put, close, clone, CLOSED, take } = require("medium");

const channelStep = (body) => ({
  type: "step",
  body: (input, errors) => {
    const bodyErrors = clone(errors);
    const output = body(input, bodyErrors);

    go(async () => {
      const value = await take(bodyErrors);
      await put(errors, value);
      if (value !== CLOSED) {
        close(input);
      }
    });

    return output;
  },
});

module.exports = channelStep;

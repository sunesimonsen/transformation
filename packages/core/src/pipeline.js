const { chan, go, take, put, close, CLOSED } = require("medium");
const channelStep = require("./channelStep");
const map = require("./map");

const pipeline = (...steps) =>
  channelStep((input, errors) => {
    const output = chan();

    go(async () => {
      let channel = input;

      try {
        for (let stepOrChannel of steps) {
          if (stepOrChannel) {
            if (!stepOrChannel.buffer && stepOrChannel.then) {
              stepOrChannel = await stepOrChannel;
            }

            if (typeof stepOrChannel === "function") {
              stepOrChannel = map(stepOrChannel);
            }

            channel =
              stepOrChannel.type === "step"
                ? stepOrChannel.body(channel, errors)
                : stepOrChannel;
          }
        }

        while (true) {
          const value = await take(channel);
          if (value === CLOSED) break;
          const open = await put(output, value);
          if (!open) break;
        }
      } catch (err) {
        await put(errors, err);
      } finally {
        close(output);
      }
    });

    return output;
  });

module.exports = pipeline;

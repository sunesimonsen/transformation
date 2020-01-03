const { chan, go, take, put, close, CLOSED } = require("medium");
const channelStep = require("./channelStep");

const pipeline = (...steps) =>
  channelStep((input, errors) => {
    const output = chan();

    go(async () => {
      let channel = input || chan();

      try {
        for (let stepOrChannel of steps) {
          if (stepOrChannel) {
            if (!stepOrChannel.buffer && stepOrChannel.then) {
              stepOrChannel = await stepOrChannel;
            }

            channel =
              stepOrChannel.type === "step"
                ? stepOrChannel.body(channel, errors)
                : stepOrChannel;
          }
        }

        if (!input) {
          close(channel);
        }

        while (true) {
          const value = await take(channel);
          if (value === CLOSED) break;
          await put(output, value);
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

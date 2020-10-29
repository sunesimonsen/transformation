const { channelStep, program, forEach } = require("@transformation/core");
const { fromStream, toStream } = require("@transformation/stream");
const { go, chan, put, close } = require("medium");

const throughChildProcess = childProcess =>
  channelStep((input, errors) => {
    const output = chan();

    go(async () => {
      await program(input, toStream(childProcess.stdin));
    });

    go(async () => {
      await program(
        fromStream(childProcess.stdout),
        forEach(value => put(output, value))
      );
    });

    childProcess.stderr.on("data", data => {
      errorMessage += Buffer.isBuffer(data) ? data.toString("utf8") : data;
    });

    let errorMessage = "";
    childProcess.on("error", async err => {
      await put(errors, err);
      close(output);
    });

    childProcess.on("close", async code => {
      if (code !== 0) {
        await put(errors, new Error(errorMessage.trim()));
      }
      close(output);
    });

    return output;
  });

module.exports = throughChildProcess;

const { go, close, CLOSED, chan, put, take } = require("medium");
const channelStep = require("./channelStep");
const cp = require("child_process");
const pipeline = require("./pipeline");

const startProcess = childProcessPath => {
  const childProcess = cp.fork(childProcessPath);

  return channelStep((input, errors) => {
    const output = chan();
    const ack = chan();

    childProcess.on("message", async ({ type, data }) => {
      switch (type) {
        case "closed":
          close(output);
          childProcess.kill();
          break;
        case "ack":
          put(ack, "ack");
          break;
        case "error":
          const err = new (global[data.type] || Error)(data.properties.message);
          for (let [key, value] of Object.entries(data.properties)) {
            err[key] = value;
          }

          await put(errors, err);
          close(output);
          break;
        default:
          await put(output, data);
          childProcess.send({ type: "ack" });
          break;
      }
    });

    childProcess.on("error", async err => {
      await put(errors, err);
      close(output);
    });

    go(async () => {
      while (true) {
        const value = await take(input);

        if (value === CLOSED) {
          childProcess.send({ type: "closed" });
          break;
        } else {
          childProcess.send({ type: "payload", data: value });
        }

        await take(ack);
      }
    });

    return output;
  });
};

const childProcess = (...steps) => {
  const input = chan();
  const errors = chan();
  const output = pipeline(...steps).body(input, errors);
  const ack = chan();

  process.on("message", async ({ type, data }) => {
    switch (type) {
      case "closed":
        close(input);
        break;
      case "ack":
        put(ack, "ack");
        break;
      default:
        await put(input, data);
        process.send({ type: "ack" });
        break;
    }
  });

  process.on("uncaughtException", err => {
    process.send({ type: "error", data: err.message });
  });

  go(async () => {
    while (true) {
      const value = await take(output);
      if (value === CLOSED) {
        close(errors);
        process.send({ type: "closed" });
        break;
      }

      process.send({ type: "payload", data: value });

      await take(ack);
    }
  });

  go(async () => {
    while (true) {
      const value = await take(errors);
      if (value === CLOSED) break;

      const properties = {};
      for (let p of Object.getOwnPropertyNames(value)) {
        properties[p] = value[p];
      }

      process.send({
        type: "error",
        data: { type: value.constructor.name, properties }
      });
    }
  });
};

module.exports = {
  startProcess,
  childProcess
};

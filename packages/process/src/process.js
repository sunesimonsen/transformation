const { go, close, CLOSED, chan, put, take } = require("medium");
const { channelStep, pipeline } = require("@transformation/core");
const cp = require("child_process");

const createError = (data) => {
  const ErrorType = global[data.type] || Error;
  const err = new ErrorType(data.properties.message);
  for (const [key, value] of Object.entries(data.properties)) {
    err[key] = value;
  }
  return err;
};

const startProcess = (childProcessPath) =>
  channelStep((input, errors) => {
    let failed = false;
    const childProcess = cp.fork(childProcessPath);
    const output = chan();
    const ack = chan();

    const cleanup = () => {
      close(input);
      close(ack);
      close(output);
      childProcess.kill();
    };

    childProcess.on("message", async ({ type, data }) => {
      switch (type) {
        case "closed":
          cleanup();
          break;
        case "ack":
          await put(ack, "ack");
          break;
        case "error":
          failed = true;
          await put(errors, createError(data));
          cleanup();
          break;
        default:
          await put(output, data);
          childProcess.send({ type: "ack" });
          break;
      }
    });

    childProcess.on("error", async (err) => {
      if (!failed) {
        failed = true;
        await put(errors, err);
        cleanup();
      }
    });

    go(async () => {
      while (true) {
        if (failed) break;

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

const childProcess = (...steps) => {
  let failed = false;
  const input = chan();
  const errors = chan();
  const output = pipeline(...steps).body(input, errors);
  const ack = chan();

  const cleanup = () => {
    close(input);
    close(output);
    close(errors);
    close(ack);
  };

  process.on("message", async ({ type, data }) => {
    switch (type) {
      case "closed":
        close(input);
        break;
      case "ack":
        await put(ack, "ack");
        break;
      default:
        await put(input, data);
        process.send({ type: "ack" });
        break;
    }
  });

  process.on("uncaughtException", (err) => {
    if (!failed) {
      process.send({ type: "error", data: err.message });
      failed = true;

      cleanup();
    }
  });

  go(async () => {
    while (true) {
      if (failed) break;

      const value = await take(output);
      if (value === CLOSED) {
        process.send({ type: "closed" });
        break;
      }

      process.send({ type: "payload", data: value });

      await take(ack);
    }

    cleanup();
  });

  go(async () => {
    while (true) {
      if (failed) break;

      const value = await take(errors);
      if (value === CLOSED) break;

      const properties = {};
      for (const p of Object.getOwnPropertyNames(value)) {
        properties[p] = value[p];
      }

      failed = true;
      process.send({
        type: "error",
        data: { type: value.constructor.name, properties },
      });

      cleanup();
    }
  });
};

module.exports = {
  startProcess,
  childProcess,
};

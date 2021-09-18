const emitItems = require("./emitItems");
const step = require("./step");
const takeAll = require("./takeAll");

const { sleep } = require("medium");

const linearBackoff = (delay) => (attemp) => delay;
const exponentialBackoff = (delay) => (attempt) => delay * Math.pow(2, attempt);

const retryPromise = async (options, cb) => {
  const { max = 5, delay = 100, strategy = "exponential" } = options;

  let err;

  const backoff =
    strategy === "linear" ? linearBackoff(delay) : exponentialBackoff(delay);

  for (let i = 0; i < max; i++) {
    try {
      return await cb();
    } catch (e) {
      err = e;
    }

    await sleep(backoff(i));
  }

  throw err;
};

const retry = (...args) => {
  const hasOptions = args[0] && args[0].type !== "step";

  const steps = hasOptions ? args.slice(1) : args;
  const options = hasOptions ? args[0] : {};

  return step(async ({ take, put, CLOSED }) => {
    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      const items = await retryPromise(options, () =>
        takeAll(emitItems(value), ...steps)
      );

      for (const item of items) {
        await put(item);
      }
    }
  });
};

module.exports = retry;

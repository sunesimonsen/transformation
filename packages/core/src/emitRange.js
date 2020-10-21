const emitAll = require("./emitAll");

function* range(start, end, step) {
  const decreasing = step < 0;
  if (decreasing) {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  }
}

const emitRange = (...args) => {
  if (args.length === 1) {
    const start = 0;
    const end = args[0];
    const step = end < 0 ? -1 : 1;
    return emitAll(range(start, end, step));
  } else if (args.length === 2) {
    const start = args[0];
    const end = args[1];
    const step = end < start ? -1 : 1;
    return emitAll(range(start, end, step));
  } else if (args[2] === 0) {
    throw new Error("A step of zero is not supported");
  } else {
    return emitAll(range(...args));
  }
};

module.exports = emitRange;

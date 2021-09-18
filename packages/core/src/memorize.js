const pipeline = require("./pipeline");
const chose = require("./chose");
const map = require("./map");
const transform = require("./transform");
const forEach = require("./forEach");
const LRU = require("lru");

const memorize = (step, { maxSize = Infinity, key = (v) => v } = {}) => {
  const keySelector = typeof key === "string" ? (value) => value[key] : key;

  const lru = new LRU(maxSize);

  const has = (value) => typeof lru.peek(keySelector(value)) !== "undefined";

  return pipeline(
    chose((value) => (has(value) ? "cached" : "notCached"), {
      cached: map((value) => lru.get(keySelector(value))),
      notCached: pipeline(
        map((value) => ({ key: keySelector(value), output: value })),
        transform({
          output: step,
        }),
        forEach(({ key, output }) => {
          lru.set(key, output);
        }),
        map(({ output }) => output)
      ),
    })
  );
};

module.exports = memorize;

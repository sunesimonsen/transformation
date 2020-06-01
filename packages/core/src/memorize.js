const pipeline = require("./pipeline");
const chose = require("./chose");
const map = require("./map");
const transform = require("./transform");
const forEach = require("./forEach");
const QuickLRU = require("quick-lru");

const memorize = (step, { maxSize = 1000, key = v => v } = {}) => {
  const keySelector = typeof key === "string" ? value => value[key] : key;

  const lru = new QuickLRU({ maxSize });

  return pipeline(
    chose(value => (lru.has(keySelector(value)) ? "cached" : "notCached"), {
      cached: map(value => lru.get(keySelector(value))),
      notCached: pipeline(
        map(value => ({ key: keySelector(value), output: value })),
        transform({
          output: step
        }),
        forEach(({ key, output }) => {
          lru.set(key, output);
        }),
        map(({ output }) => output)
      )
    })
  );
};

module.exports = memorize;

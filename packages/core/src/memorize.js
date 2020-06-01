const pipeline = require("./pipeline");
const chose = require("./chose");
const map = require("./map");
const transform = require("./transform");
const forEach = require("./forEach");
const tap = require("./tap");
const QuickLRU = require("quick-lru");

const memorize = async (step, { maxSize = 1000, key = v => v } = {}) => {
  const keySelector = typeof key === "string" ? value => value[key] : key;

  const lru = new QuickLRU({ maxSize });

  return pipeline(
    tap(v => `check: ${keySelector(v)}`),
    chose(value => (lru.has(keySelector(value)) ? "cached" : "notCached"), {
      cached: pipeline(
        tap(v => `cached: ${keySelector(v)} ${v}`),
        map(value => lru.get(keySelector(value)))
      ),
      notCached: pipeline(
        map(value => ({ key: keySelector(value), output: value })),
        transform({
          output: step
        }),
        forEach(({ key, output }) => {
          console.log(key, output);
          lru.set(key, output);
        }),
        tap(v => `cached: ${v.key}`),
        map(({ output }) => output)
      )
    })
  );
};

module.exports = memorize;

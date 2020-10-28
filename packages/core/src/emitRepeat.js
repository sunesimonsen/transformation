const emitAll = require("./emitAll");

function* repeat(items, limit) {
  for (let i = 0; i < limit; i++) {
    yield items[i % items.length];
  }
}

const emitRepeat = (items, limit = Infinity) =>
  emitAll(repeat(Array.isArray(items) ? items : [items], limit));

module.exports = emitRepeat;

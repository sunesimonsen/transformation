const map = require("./map");
const pipeline = require("./pipeline");
const takeAll = require("./takeAll");
const emitItems = require("./emitItems");
const tap = require("./tap");

const withGroup = (...steps) =>
  map(async grouping => {
    const entries = await Promise.all(
      Object.keys(grouping).map(async key => [
        key,
        await takeAll(pipeline(emitItems(...grouping[key]), ...steps))
      ])
    );

    return entries.reduce((result, [key, items]) => {
      result[key] = items;
      return result;
    }, {});
  });

module.exports = withGroup;

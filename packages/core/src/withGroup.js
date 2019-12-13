const map = require("./map");
const pipeline = require("./pipeline");
const takeAll = require("./takeAll");
const emitItems = require("./emitItems");
const tap = require("./tap");

const withGroup = (...steps) =>
  map(async group => ({
    ...group,
    items: await takeAll(pipeline(emitItems(...group.items), ...steps))
  }));

module.exports = withGroup;

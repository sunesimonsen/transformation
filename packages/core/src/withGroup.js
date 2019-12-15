const map = require("./map");
const pipeline = require("./pipeline");
const takeAll = require("./takeAll");
const emitItems = require("./emitItems");
const Group = require("./Group");

const withGroup = (...steps) =>
  map(async group =>
    Group.isGroup(group)
      ? {
          ...group,
          items: await takeAll(pipeline(emitItems(...group.items), ...steps))
        }
      : group
  );

module.exports = withGroup;

const map = require("./map");
const takeAll = require("./takeAll");
const emitItems = require("./emitItems");
const Group = require("./Group");

const withGroup = (...steps) =>
  map(async group =>
    Group.isGroup(group)
      ? {
          ...group,
          items: await takeAll(emitItems(...group.items), ...steps)
        }
      : group
  );

module.exports = withGroup;

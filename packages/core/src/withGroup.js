const map = require("./map");
const takeAll = require("./takeAll");
const emitAll = require("./emitAll");
const Group = require("./Group");

const withGroup = (...steps) =>
  map(async group =>
    Group.isGroup(group)
      ? {
          ...group,
          items: await takeAll(emitAll(group.items), ...steps)
        }
      : group
  );

module.exports = withGroup;

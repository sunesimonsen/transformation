const step = require("./step");
const Group = require("./Group");

const groupBy = (fieldOrSelector) => {
  const selector =
    typeof fieldOrSelector === "string"
      ? (value) => value[fieldOrSelector]
      : fieldOrSelector;

  return step(async ({ take, put, CLOSED }) => {
    const grouping = {};
    const items = [];
    while (true) {
      const value = await take();
      if (value === CLOSED) break;
      items.push(value);
    }

    items.forEach((item) => {
      const key = selector(item);
      const group = grouping[key];
      if (group) {
        group.push(item);
      } else {
        grouping[key] = [item];
      }
    });

    for (const [key, items] of Object.entries(grouping)) {
      await put(Group.create({ key, items }));
    }
  });
};

module.exports = groupBy;

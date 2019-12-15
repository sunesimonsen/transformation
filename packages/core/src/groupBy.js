const { go, close, chan, put } = require("medium");
const takeAll = require("./takeAll");
const Group = require("./Group");

const groupBy = fieldOrSelector => input => {
  const selector =
    typeof fieldOrSelector === "string"
      ? value => value[fieldOrSelector]
      : fieldOrSelector;

  const output = chan();

  go(async () => {
    const grouping = {};
    const items = await takeAll(input);

    items.forEach(item => {
      const key = selector(item);
      const group = grouping[key];
      if (group) {
        group.push(item);
      } else {
        grouping[key] = [item];
      }
    });

    for (let [key, items] of Object.entries(grouping)) {
      await put(output, Group.create({ key, items }));
    }

    close(output);
  });

  return output;
};

module.exports = groupBy;

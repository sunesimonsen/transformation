const create = ({ key, items, ...other }) => {
  return {
    key,
    items,
    ...other,
  };
};

const isGroup = (group) =>
  group &&
  typeof group === "object" &&
  "key" in group &&
  Array.isArray(group.items);

module.exports = {
  create,
  isGroup,
};

const groupSymbol = Symbol("group");

const create = ({ key, items, ...other }) => {
  return {
    [groupSymbol]: true,
    key,
    items,
    ...other
  };
};

const isGroup = value => value && groupSymbol in value;

module.exports = {
  create,
  isGroup
};

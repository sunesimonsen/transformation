const groupSymbol = Symbol("group");

const createGroup = ({ key, items, ...other }) => {
  return {
    [groupSymbol]: true,
    key,
    items,
    ...other
  };
};

const isGroup = value => value && groupSymbol in value;

module.exports = {
  createGroup,
  isGroup
};

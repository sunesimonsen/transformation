const reduce = require("./reduce");

const toArray = () =>
  reduce((result, value) => {
    result.push(value);
    return result;
  }, []);

module.exports = toArray;

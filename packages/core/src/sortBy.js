const pipeline = require("./pipeline");
const toArray = require("./toArray");
const splitArray = require("./splitArray");
const map = require("./map");

const sortBy = (...ordering) => {
  const comparisons = ordering.map(order => {
    if (typeof order === "function") {
      return order;
    }

    const [field, direction = "asc"] = order.split(":");

    return (a, b) => {
      if (a[field] === b[field]) {
        return 0;
      }

      if (direction === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    };
  });

  return pipeline(
    toArray(),
    map(arr =>
      arr.sort((a, b) => {
        for (var i = 0; i < comparisons.length; i += 1) {
          const comparison = comparisons[i];
          const result = comparison(a, b);
          if (result !== 0) {
            return result;
          }
        }
      })
    ),
    splitArray()
  );
};

module.exports = sortBy;

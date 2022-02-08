const map = require("./map");

const defaults = (defaultValues) =>
  map((value) =>
    value && typeof value === "object" ? { ...defaultValues, ...value } : value
  );

module.exports = defaults;

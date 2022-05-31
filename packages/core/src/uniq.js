const uniqBy = require("./uniqBy");

const uniq = (options) => uniqBy((v) => v, options);

module.exports = uniq;

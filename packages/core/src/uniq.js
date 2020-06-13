const uniqBy = require("./uniqBy");

const uniq = () => uniqBy(v => v);

module.exports = uniq;

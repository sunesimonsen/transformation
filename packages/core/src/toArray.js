const reduce = require("./reduce");

const toArray = () => reduce((result, value) => [...result, value], []);

module.exports = toArray;

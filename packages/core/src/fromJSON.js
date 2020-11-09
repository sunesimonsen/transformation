const map = require("./map");

const fromJSON = (...args) => map((v) => JSON.parse(v, ...args));

module.exports = fromJSON;

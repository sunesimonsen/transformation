const map = require("./map");

const toJSON = (...args) => map((v) => JSON.stringify(v, ...args));

module.exports = toJSON;

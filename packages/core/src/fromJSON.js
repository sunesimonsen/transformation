const map = require("./map");

const fromJSON = () => map(v => JSON.parse(v));

module.exports = fromJSON;

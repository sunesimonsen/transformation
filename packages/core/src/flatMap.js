const pipeline = require("./pipeline");
const map = require("./map");
const splitArray = require("./splitArray");

const flatMap = (...args) => pipeline(map(...args), splitArray());

module.exports = flatMap;

const pipeline = require("./pipeline");
const map = require("./map");
const splitIterable = require("./splitIterable");

const flatMap = (...args) => pipeline(map(...args), splitIterable());

module.exports = flatMap;

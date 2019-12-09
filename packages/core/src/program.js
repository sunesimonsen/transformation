const { chan } = require("medium");
const flush = require("./flush");
const pipeline = require("./pipeline");

const program = (...steps) => flush(pipeline(...steps));

module.exports = program;

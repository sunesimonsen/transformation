const { sleep } = require("medium");
const forEach = require("./forEach");

const delay = (ms) => forEach(() => sleep(ms));

module.exports = delay;

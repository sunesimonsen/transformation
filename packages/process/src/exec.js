const cp = require("child_process");
const throughChildProcess = require("./throughChildProcess");

const exec = (...args) => throughChildProcess(cp.exec(...args));

module.exports = exec;

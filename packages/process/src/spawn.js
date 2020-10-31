const cp = require("child_process");
const throughChildProcess = require("./throughChildProcess");

const spawn = (...args) => throughChildProcess(cp.spawn(...args));

module.exports = spawn;

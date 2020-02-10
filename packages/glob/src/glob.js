const { emitItems, pipeline } = require("@transformation/core");
const globEach = require("./globEach");

const glob = (options = {}) => pipeline(emitItems(options), globEach());

module.exports = glob;

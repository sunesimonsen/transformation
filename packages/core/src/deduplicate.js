const deduplicateBy = require("./deduplicateBy");

const deduplicate = () => deduplicateBy((v) => v);

module.exports = deduplicate;

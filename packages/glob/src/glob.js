const globby = require("globby");
const path = require("path");
const { emitAll, map, pipeline } = require("@transformation/core");

const glob = (options = {}) => {
  options =
    typeof options === "string" || Array.isArray(options)
      ? { pattern: options }
      : options;

  return pipeline(
    emitAll(
      globby.stream(options.pattern, {
        ...options,
        absolute: false
      })
    ),
    options.absolute && map(pathName => path.resolve(options.cwd, pathName))
  );
};

module.exports = glob;

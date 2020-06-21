const globby = require("globby");
const path = require("path");
const { pipeline, flatMap } = require("@transformation/core");

const globEach = (options = {}) => {
  options =
    typeof options === "string" || Array.isArray(options)
      ? { pattern: options }
      : options;

  return pipeline(
    flatMap(async function*(value) {
      const { cwd = options.cwd, pattern = options.pattern } =
        typeof value === "string" || Array.isArray(value)
          ? { pattern: value }
          : value;

      const pathNames = globby.stream(pattern, {
        ...options,
        absolute: false,
        cwd
      });

      for await (const pathName of pathNames) {
        if (options.absolute) {
          yield path.resolve(cwd, pathName);
        } else {
          yield pathName;
        }
      }
    })
  );
};

module.exports = globEach;

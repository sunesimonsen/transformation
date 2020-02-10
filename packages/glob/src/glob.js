const globby = require("globby");
const path = require("path");
const { step } = require("@transformation/core");

const glob = (options = {}) =>
  step(async ({ put, CLOSED }) => {
    options =
      typeof options === "string" || Array.isArray(options)
        ? { pattern: options }
        : options;

    for await (const pathName of globby.stream(options.pattern, {
      ...options,
      absolute: false
    })) {
      if (options.absolute) {
        await put(path.resolve(options.cwd, pathName));
      } else {
        await put(pathName);
      }
    }
  });

module.exports = glob;

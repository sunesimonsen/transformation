const globby = require("globby");
const path = require("path");
const { step } = require("@transformation/core");

const glob = (options = {}) =>
  step(async ({ take, put, CLOSED }) => {
    options =
      typeof options === "string" || Array.isArray(options)
        ? { pattern: options }
        : options;

    while (true) {
      const value = await take();
      if (value === CLOSED) break;

      const { cwd = options.cwd, pattern } =
        typeof value === "string" || Array.isArray(value)
          ? { pattern: value }
          : value;

      for await (const pathName of globby.stream(pattern || options.pattern, {
        ...options,
        absolute: false,
        cwd
      })) {
        if (options.absolute) {
          await put(path.resolve(cwd, pathName));
        } else {
          await put(pathName);
        }
      }
    }
  });

module.exports = glob;

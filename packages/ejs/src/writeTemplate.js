const ejs = require("ejs");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const { map } = require("@transformation/core");

const writeTemplate = async (
  templatePath,
  outputPathOrFunction,
  options = {}
) => {
  const outputPathFunction =
    typeof outputPathOrFunction === "function"
      ? outputPathOrFunction
      : () => outputPathOrFunction;

  const templateSource = await readFile(templatePath, "utf-8");

  const template = ejs.compile(templateSource, {
    ...options,
    filename: templatePath
  });

  return map(value =>
    writeFile(
      outputPathFunction(value),
      template(Array.isArray(value) ? { items: value } : value)
    )
  );
};

module.exports = writeTemplate;

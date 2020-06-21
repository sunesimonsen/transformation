const ejs = require("ejs");
const fs = require("fs").promises;
const { forEach } = require("@transformation/core");

const writeTemplate = async (
  templatePath,
  outputPathOrFunction,
  options = {}
) => {
  const outputPathFunction =
    typeof outputPathOrFunction === "function"
      ? outputPathOrFunction
      : () => outputPathOrFunction;

  const templateSource = await fs.readFile(templatePath, "utf8");

  const template = ejs.compile(templateSource, {
    ...options,
    filename: templatePath
  });

  return forEach(value =>
    fs.writeFile(
      outputPathFunction(value),
      template(Array.isArray(value) ? { items: value } : value)
    )
  );
};

module.exports = writeTemplate;

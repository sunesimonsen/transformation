const ejs = require("ejs");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const { map } = require("@transformation/core");

const renderTemplate = async (templatePath, options = {}) => {
  const templateSource = await readFile(templatePath, "utf-8");

  const template = ejs.compile(templateSource, {
    ...options
  });

  return map(value =>
    template(Array.isArray(value) ? { items: value } : value)
  );
};

module.exports = renderTemplate;

const ejs = require("ejs");
const fs = require("fs").promises;
const { map } = require("@transformation/core");

const renderTemplate = async (templatePath, options = {}) => {
  const templateSource = await fs.readFile(templatePath, "utf8");

  const template = ejs.compile(templateSource, {
    ...options,
    filename: templatePath
  });

  return map(value =>
    template(Array.isArray(value) ? { items: value } : value)
  );
};

module.exports = renderTemplate;

const map = require("./map");
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");

const withField = (name, ...steps) =>
  map(async item => {
    if (!item || typeof item !== "object" || !(name in item)) {
      return item;
    }

    const result = await takeAll(pipeline(emitItems(item[name]), ...steps));

    if (result.length !== 1) {
      throw new Error("withField must produce only one value");
    }

    return {
      ...item,
      [name]: result[0]
    };
  });

module.exports = withField;

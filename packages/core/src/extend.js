const map = require("./map");
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");

const executeExtend = async (extension, value, input) => {
  if (typeof extension === "undefined") {
    return value;
  } else if (extension.type === "step") {
    const result = await takeAll(pipeline(emitItems(input), extension));

    if (result.length !== 1) {
      throw new Error("Field extensions must produce only one value");
    }

    return result[0];
  }

  if (Array.isArray(extension)) {
    return Promise.all(
      extension.map((_, i) => executeExtend(extension[i], value[i], input))
    );
  }

  if (typeof extension === "object" && extension.constructor === Object) {
    const transformedObject = { ...value };

    const entries = await Promise.all(
      Object.keys(extension).map(async key => [
        key,
        await executeExtend(extension[key], value[key], input)
      ])
    );

    entries.forEach(([key, value]) => {
      transformedObject[key] = value;
    });

    return transformedObject;
  }

  return value;
};

const extend = extension =>
  map(value =>
    value && typeof value === "object"
      ? executeExtend(extension, value, value)
      : value
  );

module.exports = extend;
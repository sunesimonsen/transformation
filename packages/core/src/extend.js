const map = require("./map");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");

const executeExtend = async (extension, value, input) => {
  if (typeof extension === "undefined") {
    return value;
  }

  if (extension.type === "step") {
    const result = await takeAll(emitItems(input), extension);

    if (result.length !== 1) {
      throw new Error("Field extensions must produce only one value");
    }

    return result[0];
  }

  if (typeof extension === "function") {
    return extension(input);
  }

  if (Array.isArray(extension)) {
    return Promise.all(
      extension.map((_, i) => executeExtend(extension[i], value[i], input))
    );
  }

  if (
    typeof extension === "object" &&
    extension.constructor === Object &&
    (typeof value === "object" || typeof value === "undefined")
  ) {
    const transformedObject = { ...value };

    const entries = await Promise.all(
      Object.keys(extension).map(async key => [
        key,
        await executeExtend(extension[key], value && value[key], input)
      ])
    );

    entries.forEach(([key, value]) => {
      transformedObject[key] = value;
    });

    return transformedObject;
  }

  return extension;
};

const extend = extension =>
  map(value =>
    value && typeof value === "object"
      ? executeExtend(extension, value, value)
      : value
  );

module.exports = extend;

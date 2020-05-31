const map = require("./map");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");

const executeTransformation = async (transformation, value) => {
  if (typeof value === "undefined" || typeof transformation === "undefined") {
    return value;
  }

  if (transformation.type === "step") {
    if (typeof value === "undefined") {
      return value;
    }

    const result = await takeAll(emitItems(value), transformation);

    if (result.length !== 1) {
      throw new Error("Field transformations must produce only one value");
    }

    return result[0];
  }

  if (Array.isArray(transformation)) {
    return Promise.all(
      transformation.map((_, i) =>
        executeTransformation(transformation[i], value[i])
      )
    );
  }

  if (
    typeof transformation === "object" &&
    transformation.constructor === Object
  ) {
    const transformedObject = { ...value };

    const entries = await Promise.all(
      Object.keys(transformation).map(async key => [
        key,
        await executeTransformation(transformation[key], value[key])
      ])
    );

    entries.forEach(([key, value]) => {
      transformedObject[key] = value;
    });

    return transformedObject;
  }

  return value;
};

const transform = transformation =>
  map(value =>
    value && typeof value === "object"
      ? executeTransformation(transformation, value)
      : value
  );

module.exports = transform;

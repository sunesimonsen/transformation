const map = require("./map");
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");

const executeTransformation = async (transformation, value) => {
  if (!value) {
    return value;
  }

  if (typeof transformation === "undefined") {
    return value;
  }

  if (transformation.type === "step") {
    if (typeof value === "undefined") {
      return value;
    }

    const result = await takeAll(pipeline(emitItems(value), transformation));

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
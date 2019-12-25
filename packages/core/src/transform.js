const map = require("./map");
const pipeline = require("./pipeline");
const emitItems = require("./emitItems");
const takeAll = require("./takeAll");

const executeTransformation = async (transformation, value) => {
  if (typeof transformation === "undefined" || typeof value === "undefined") {
    return value;
  }

  if (!value) {
    return value;
  }

  if (transformation.type === "step") {
    const result = await takeAll(pipeline(emitItems(value), transformation));

    if (result.length !== 1) {
      throw new Error("Field transformations must produce only one value");
    }

    return result[0];
  } else if (Array.isArray(value)) {
    return value.map((item, i) =>
      executeTransformation(transformation[i], item)
    );
  } else if (typeof value === "object" && value.constructor === Object) {
    const keys = Object.keys(value);
    const transformedObject = keys.reduce((result, key) => {
      result[key] = executeTransformation(transformation[key], value[key]);
      return result;
    }, {});

    for (let key of keys) {
      transformedObject[key] = await transformedObject[key];
    }

    return transformedObject;
  } else {
    return value;
  }
};

const transform = transformation =>
  map(value => executeTransformation(transformation, value));

module.exports = transform;

const Group = require("./Group");
const accumulate = require("./accumulate");
const buffer = require("./buffer");
const delay = require("./delay");
const emitItems = require("./emitItems");
const extend = require("./extend");
const fanOut = require("./fanOut");
const filter = require("./filter");
const flatMap = require("./flatMap");
const flush = require("./flush");
const forEach = require("./forEach");
const fork = require("./fork");
const groupBy = require("./groupBy");
const map = require("./map");
const partition = require("./partition");
const partitionBy = require("./partitionBy");
const pipeline = require("./pipeline");
const program = require("./program");
const reduce = require("./reduce");
const sortBy = require("./sortBy");
const splitArray = require("./splitArray");
const step = require("./step");
const takeAll = require("./takeAll");
const tap = require("./tap");
const toArray = require("./toArray");
const transform = require("./transform");

// TODO forkJoin: fork out and return array

module.exports = {
  Group,
  accumulate,
  buffer,
  delay,
  emitItems,
  extend,
  fanOut,
  filter,
  flatMap,
  flush,
  forEach,
  fork,
  groupBy,
  map,
  partition,
  partitionBy,
  pipeline,
  program,
  reduce,
  sortBy,
  splitArray,
  step,
  takeAll,
  tap,
  toArray,
  transform
};

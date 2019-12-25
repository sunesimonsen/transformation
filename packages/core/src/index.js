const Group = require("./Group");
const accumulate = require("./accumulate");
const buffer = require("./buffer");
const delay = require("./delay");
const emitItems = require("./emitItems");
const fanOut = require("./fanOut");
const filter = require("./filter");
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
const withField = require("./withField");

// TODO forkJoin: fork out and return array

module.exports = {
  Group,
  accumulate,
  partition,
  partitionBy,
  buffer,
  delay,
  emitItems,
  fanOut,
  filter,
  flush,
  forEach,
  fork,
  groupBy,
  map,
  pipeline,
  program,
  reduce,
  sortBy,
  splitArray,
  step,
  takeAll,
  tap,
  toArray,
  withField
};

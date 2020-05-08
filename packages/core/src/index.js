const Group = require("./Group");
const accumulate = require("./accumulate");
const buffer = require("./buffer");
const chose = require("./chose");
const delay = require("./delay");
const emitAll = require("./emitAll");
const emitItems = require("./emitItems");
const extend = require("./extend");
const fanOut = require("./fanOut");
const filter = require("./filter");
const flatMap = require("./flatMap");
const forEach = require("./forEach");
const fork = require("./fork");
const groupBy = require("./groupBy");
const map = require("./map");
const partition = require("./partition");
const partitionBy = require("./partitionBy");
const pipeline = require("./pipeline");
const program = require("./program");
const reduce = require("./reduce");
const sort = require("./sort");
const sortBy = require("./sortBy");
const splitArray = require("./splitArray");
const step = require("./step");
const takeAll = require("./takeAll");
const tap = require("./tap");
const toArray = require("./toArray");
const transform = require("./transform");
const unless = require("./unless");
const when = require("./when");

// TODO forkJoin: fork out and return array

module.exports = {
  Group,
  accumulate,
  buffer,
  chose,
  delay,
  emitAll,
  emitItems,
  extend,
  fanOut,
  filter,
  flatMap,
  forEach,
  fork,
  groupBy,
  map,
  partition,
  partitionBy,
  pipeline,
  program,
  reduce,
  sort,
  sortBy,
  splitArray,
  step,
  takeAll,
  tap,
  toArray,
  transform,
  unless,
  when
};

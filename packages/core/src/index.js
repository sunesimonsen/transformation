const Group = require("./Group");
const accumulate = require("./accumulate");
const buffer = require("./buffer");
const channelStep = require("./channelStep");
const chose = require("./chose");
const delay = require("./delay");
const emitAll = require("./emitAll");
const emitItems = require("./emitItems");
const emitRange = require("./emitRange");
const emitRepeat = require("./emitRepeat");
const extend = require("./extend");
const frequencies = require("./frequencies");
const parallel = require("./parallel");
const filter = require("./filter");
const flatMap = require("./flatMap");
const forEach = require("./forEach");
const fork = require("./fork");
const groupBy = require("./groupBy");
const interleave = require("./interleave");
const join = require("./join");
const keyBy = require("./keyBy");
const map = require("./map");
const memorize = require("./memorize");
const partition = require("./partition");
const partitionBy = require("./partitionBy");
const pipeline = require("./pipeline");
const program = require("./program");
const reduce = require("./reduce");
const reverse = require("./reverse");
const skip = require("./skip");
const skipLast = require("./skipLast");
const sort = require("./sort");
const sortBy = require("./sortBy");
const splitIterable = require("./splitIterable");
const step = require("./step");
const take = require("./take");
const takeAll = require("./takeAll");
const tap = require("./tap");
const toArray = require("./toArray");
const transform = require("./transform");
const uniq = require("./uniq");
const uniqBy = require("./uniqBy");
const unless = require("./unless");
const when = require("./when");
const withGroup = require("./withGroup");

// TODO forkJoin: fork out and return array

module.exports = {
  Group,
  accumulate,
  buffer,
  channelStep,
  chose,
  delay,
  emitAll,
  emitItems,
  emitRange,
  emitRepeat,
  extend,
  frequencies,
  fanOut: parallel,
  filter,
  flatMap,
  forEach,
  fork,
  groupBy,
  interleave,
  join,
  keyBy,
  map,
  memorize,
  parallel,
  partition,
  partitionBy,
  pipeline,
  program,
  reduce,
  reverse,
  skip,
  skipLast,
  sort,
  sortBy,
  splitArray: splitIterable,
  splitIterable,
  step,
  take,
  takeAll,
  tap,
  toArray,
  transform,
  uniq,
  uniqBy,
  unless,
  when,
  withGroup
};
